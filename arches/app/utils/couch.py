'''
ARCHES - a program developed to inventory and manage immovable cultural heritage.
Copyright (C) 2013 J. Paul Getty Trust and World Monuments Fund

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
'''

import json
import couchdb
from urlparse import urlparse, urljoin
from arches.app.models import models
from arches.app.models.system_settings import settings
from arches.app.utils.response import JSONResponse
from arches.app.utils.betterJSONSerializer import JSONSerializer, JSONDeserializer
from django.http import HttpRequest, HttpResponseNotFound
import arches.app.views.search as search

class Couch(object):
    def __init__(self):
        self.couch = couchdb.Server(settings.COUCHDB_URL)

    def create_db(self, name):
        # return reference to db
        if name in self.couch:
            db = self.couch[name]
        else:
            db = self.couch.create(name)

        return db

    def delete_db(self, name):
        try:
            print ('Deleting Couch DB: ', name)
            return self.couch.delete(name)
        except Exception as e:
            print e
            return connection_error
