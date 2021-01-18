define([
    'knockout',
    'underscore',
    'knockout-mapping',
    'uuid'
], function(ko, _, koMapping, uuid) {
    STEP_ID_LABEL = 'workflow-step-id';

    var WorkflowStep = function(config) {
        var self = this;

        this.id = ko.observable();
        this.workflowId = ko.observable(config.workflow ? config.workflow.id : null);

        this.classUnvisited = 'workflow-step-icon';
        this.classActive = 'workflow-step-icon active';
        this.classComplete = 'workflow-step-icon complete';
        this.classCanAdavance = 'workflow-step-icon can-advance';

        this.icon = 'fa-chevron-circle-right';
        this.title = '';
        this.subtitle = '';
        this.description = '';
        
        this.complete = ko.observable(false);
        this.required = ko.observable(ko.unwrap(config.required));
        this.autoAdvance = ko.observable(true);

        this.externalStepData = {};

        var externalStepSourceData = ko.unwrap(config.externalstepdata) || {};
        Object.keys(externalStepSourceData).forEach(function(key) {
            if (key !== '__ko_mapping__') {
                self.externalStepData[key] = {
                    stepName: externalStepSourceData[key],
                    data: config.workflow.getStepData(externalStepSourceData[key]),
                };
            }
        });
        delete config.externalstepdata;
        
        this.value = ko.observable();
        this.value.subscribe(function(value) {
            /* if we have defined that this is part of a single-resource workflow, and that this step creates the desired resource */ 
            if (self.shouldtrackresource && !ko.unwrap(config.workflow.resourceId)) {
                config.workflow.resourceId(value.resourceid)
            }
        });

        this.active = ko.computed(function() {
            return config.workflow.activeStep() === this;
        }, this);
        this.active.subscribe(function(active) {
            if (active) { 
                self.setStepIdToUrl(); 
                self.getExternalStepData();
            }
        });

        Object.keys(config).forEach(function(prop){
            if(prop !== 'workflow') {
                config[prop] = koMapping.fromJS(config[prop]);
            }
        });

        this.initialize = function() {
            var cachedId = ko.unwrap(config.id);
            if (cachedId) {
                self.id(cachedId)
            }
            else {
                self.id(uuid.generate());
            }

            var cachedValue = self.getValueFromLocalStorage();
            if (cachedValue) {
                self.value(cachedValue);
                self.complete(true);
            }

            self.value.subscribe(function(value) {
                self.setValueToLocalStorage(value);
            });
        };

        this.getValueFromLocalStorage = function() {
            return JSON.parse(localStorage.getItem(`${STEP_ID_LABEL}-${self.id()}`));
        };

        this.setValueToLocalStorage = function(value) {
            localStorage.setItem(`${STEP_ID_LABEL}-${self.id()}`, JSON.stringify(value));
        };

        this.setStepIdToUrl = function() {
            var searchParams = new URLSearchParams(window.location.search);
            searchParams.set(STEP_ID_LABEL, self.id());

            var newRelativePathQuery = `${window.location.pathname}?${searchParams.toString()}`;
            history.pushState(null, '', newRelativePathQuery);
        };

        this.getExternalStepData = function() {
            Object.keys(self.externalStepData).forEach(function(key) {
                self.externalStepData[key]['data'] = config.workflow.getStepData(externalStepSourceData[key]);
            });
        }

        _.extend(this, config);

        this.iconClass = ko.computed(function(){
            var ret = '';
            if(this.active()){
                ret = this.classActive;
            }else if(this.complete()){
                ret = this.classComplete;
            }else {
                ret = this.classUnvisited;
            }
            return ret + ' ' + ko.unwrap(this.icon);
        }, this);

        this.initialize();
    };
    return WorkflowStep;
});
