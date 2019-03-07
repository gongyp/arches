# -*- coding: utf-8 -*-
# Generated by Django 1.11.15 on 2019-023-05 14:40
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('models', '4352_format_config_number_widget'),
    ]

    operations = [
        migrations.RunSQL(
            """
            update widgets as w
            set defaultconfig = jsonb_set(defaultconfig, '{displayOnlySelectedNode}', to_jsonb(false), true)
            where w.name = 'node-value-select';

            update cards_x_nodes_x_widgets as c
            set config = jsonb_set(config, '{displayOnlySelectedNode}', to_jsonb(false), true)
            where c.widgetid = 'f5d6b190-bbf0-4dc9-b991-1debab8cb4a9';
            """,
            """
            update widgets as w
            set defaultconfig = defaultconfig - 'displayOnlySelectedNode'
            where w.name = 'node-value-select';

            update cards_x_nodes_x_widgets as c
            set config = config - 'displayOnlySelectedNode'
            where c.widgetid = 'f5d6b190-bbf0-4dc9-b991-1debab8cb4a9';
            """)
        ]
