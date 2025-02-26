/**
 * Created by jayhamilton on 1/31/17.
 */
export const boardLayouts = [

    {
        id: 0,
        boardInstanceId: 0,
        title: 'one-narrow',
        checked: false,
        structure: '12',
        rows: [{
            columns: [
                {
                    styleClass: 'twelve wide',

                }]
        }]
    },
    {
        id: 1,
        boardInstanceId: 1,
        title: 'single',
        checked: false,
        structure: '16',
        rows: [{
            columns: [
                {
                    styleClass: 'sixteen wide',

                }]
        }]
    },
    {
        id: 2,
        boardId: 2,
        title: 'narrow-right',
        checked: false,
        structure: '10-6',
        rows: [{
            columns: [
                {
                    styleClass: 'ten wide',

                },
                {
                    styleClass: 'six wide',

                }]
        }]
    },
    {
        id: 3,
        boardInstanceId: 3,
        title: 'wide-center',
        checked: false,
        structure: '4-8-4',
        rows: [{
            columns: [
                {
                    styleClass: 'four wide',

                },
                {
                    styleClass: 'eight wide',

                },
                {
                    styleClass: 'four wide',

                }]
        }]
    },
    {
        id: 4,
        boardInstanceId: 4,
        title: 'narrow-left',
        checked: false,
        structure: '6-10',
        rows: [{
            columns: [
                {
                    styleClass: 'six wide',

                },
                {
                    styleClass: 'ten wide',

                }]
        }]
    },
    {
        id: 5,
        boardInstanceId: 5,
        title: 'two-even',
        checked: true,
        structure: '8-8',
        rows: [{
            columns: [
                {
                    styleClass: 'eight wide',

                },
                {
                    styleClass: 'eight wide',

                }]
        }]
    },
    {
        id: 7,
        boardInstanceId: 7,
        title: 'wide-top',
        checked: false,
        structure: '16/8-8',
        rows: [{
            columns: [
                {
                    styleClass: 'sixteen wide'
                }
            ]
        },
        {
            columns: [
                {
                    styleClass: 'eight wide'
                },
                {
                    styleClass: 'eight wide'
                }
            ]
        }]
    },
    {
        id: 8,
        boardInstanceId: 8,
        title: 'ngadmin',
        checked: false,
        structure: '4-4-4-4/8-4-4',
        rows: [
            {
                columns: [
                    {
                        styleClass: 'four wide'
                    },
                    {
                        styleClass: 'four wide'
                    },
                    {
                        styleClass: 'four wide'
                    },
                    {
                        styleClass: 'four wide'
                    }
                ]
            },
            {
                columns: [
                    {
                        styleClass: 'eight wide'
                    },
                    {
                        styleClass: 'four wide'
                    },
                    {
                        styleClass: 'four wide'
                    }
                ]
            }
        ]
    },
    {
        id: 9,
        boardInstanceId: 9,
        title: 'google-layout',
        checked: false,
        structure: '3-6-3',
        rows: [
            {
                columns: [
                    {
                        styleClass: 'three wide'
                    },
                    {
                        styleClass: 'six wide'
                    },
                    {
                        styleClass: 'three wide'
                    }
                ]
            }
        ]
    }

];
