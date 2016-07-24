{
    'tpid': 1,
    'type': 'crossfit',
    'color': '#FFFFFF',
    'name': '20160101',
    'section_total': 3,
    'movement_total': 10,
    'sections': [
        {
            'name': 'Fight Gone Bad',
            'movements': [
                {
                    'tmid': 1,
                    'name': 'Wall Ball', // 环节名字
                    'type': 'movement', // 动作 or 休息 or 说明
                    // 仅当type=movement时才有，器材名字和icon url
                    'equipment': {
                        'name': '器材名字',
                        'icon': 'http://img.leadfit.cn/...'
                    },
                    'reps': 10, // 重复次数
                    // 动作规格
                    'spec': {
                        // 男女分别指定时出现
                        'male': [ // 有序数组
                            {
                                'name': 'rx', // 级别名
                                'units': 'lb', // 单位
                                'volume': 16 // 值
                            }
                            {
                                'name': 'scale', // 级别名
                                'units': 'lb', // 级别名
                                'volume': 16 // 级别名
                            }
                            .. // 有几个级别就出现几个
                        ],
                        'female': [
                            {
                                'name': 'rx',
                                'units': 'lb',
                                'volume': 12
                            }
                            {
                                'name': 'scale',
                                'units': 'lb',
                                'volume': 8
                            }
                        ]
                    },
                    score: 'amount' // times
                },
                'pattern': [
                    {
                        
                        'type': 'fix', // var, tabata, emom, amrap
                        'define': { // fix
                            rounds: 3,
                            reps: 15
                        },
                        'define': [ // var
                            21,
                            15,
                            9
                        ],
                        'define': { // tabata
                            execute: 40,
                            rest: 20,
                            rounds: 8
                        },
                        'define': { // emom
                            execute: 40,
                            rounds: 8, // 可选
                            alter: 1,
                        },
                        'define': { // amrap
                            tc: 12
                        },
                        'score': rounds // times, amount
                    }
                ],
                score: [
                    'time',
                    'times',
                    'amount'
                ]
            ]
        },
        ...
    ]
},