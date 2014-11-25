define(['jquery', 'backbone', 'knockout', 'knockout-mapping', 'underscore'], function ($, Backbone, ko, koMapping, _) {
    return Backbone.View.extend({
        viewModel: null,
        key: '',
        pkField: '',

        events: {
            'click .add-button': 'addItem',
            'click .arches-CRUD-delete ': 'deleteItem'
        },

        initialize: function(options) {
            _.extend(this, _.pick(options, 'viewModel', 'key', 'pkField'));

            this.viewModel[this.key] = ko.observableArray(this.viewModel[this.key]);
            this.viewModel.editing[this.key] = koMapping.fromJS(this.viewModel.defaults[this.key]);
        },

        addItem: function() {
            this.viewModel[this.key].push(ko.toJS(this.viewModel.editing[this.key]));
            koMapping.fromJS(this.viewModel.defaults[this.key], this.viewModel.editing[this.key]);
        },

        deleteItem: function(el) {
            var self = this,
                data = $(el.target).data();

            this.viewModel[this.key].remove(function(item) {
                return item[self.pkField] === data[self.pkField.toLowerCase()];
            });
        }
    });
});