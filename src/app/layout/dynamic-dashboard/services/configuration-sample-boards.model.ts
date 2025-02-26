export const sampleBoardCollection =
{
    board: [{
        title: 'Dashboard', structure: '8-8', id: 5, boardInstanceId: 0, rows: [{
            columns: [{
                styleClass: 'eight wide', gadgets: [{
                    componentType: 'AnnouncementGadgetComponent', name: 'Announcements', description: 'Monthly announcements',
                    icon: 'icon-announcement-list', instanceId: 1636710253151, tags: [{ facet: 'News', name: 'Announcements' }], config: {
                        propertyPages: [{
                            displayName: 'Run', groupId: 'run', position: 10,
                            properties: [{ value: '', key: 'endpoint', label: 'News URL', required: false, order: 3, controlType: 'dynamicdropdown' },
                            { value: 'Announcements', key: 'title', label: 'Title', required: false, order: 1, controlType: 'textbox' },
                            { value: 2, key: 'instanceId', label: '', required: false, order: -1, controlType: 'hidden' }]
                        }]
                    }, actions: [{ name: 'Add' }]
                }]
            }, { styleClass: 'eight wide', gadgets: [] }]
        }]
    }]
};
