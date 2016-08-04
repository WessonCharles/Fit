{
    'tpid': 1,
    'type': 'crossfit',
    // 'color': '#FFFFFF',//暂时注释  以随机颜色显示
    'name': '20160101',
    'ref':'20160101',//以天为单位的时间戳键 用来在相应的日期显示
    'section_total': 3,
    'movement_total': 10,
    'sections': [//环节
        {   
            'secid':1,//环节应该有个对应的ID
            'name': 'Fight Gone Bad',//环节名称
            'type':'',//环节类型   18种环节
            'movements': [//动作相关
                {//每个大括号一条  每条三个总属性 每个总属性代表不同类型的分属性
                    'tmid': 1,//id都放在每条的第一层级
                    'sortid':0,//排序id
                    'action':{//动作基本属性
                        'name': 'Wall Ball', // 动作名字
                        'type': 'movement', // 动作 or 休息 rest or 说明 intro
                        // 仅当type=movement时才有，器材名字和icon url
                        'equipment': {
                            'name': '器材名字',
                            'icon': 'http://img.leadfit.cn/...'
                        },
                        'reps': 10, // 重复次数
                        // 动作规格
                        'spec': [{
                            //男女未分别指定时
                            'name':'rx',
                            'man':[
                                {
                                    'lb':16,
                                    'in':10
                                },
                                ...
                            ]
                            // 男女分别指定时出现
                            'male': [ // 有序数组
                                {
                                    // 'units': 'lb', // 单位
                                    // 'volume': 16 // 值
                                    'lb':16,//重量
                                    'in':10//高度
                                }
                                {
                                    'units': 'lb', // 级别名
                                    'volume': 16 // 级别名
                                }
                                .. // 有几个级别就出现几个
                            ],
                            'female': [
                                {
                                    // 'name': 'rx',
                                    'units': 'lb',
                                    'volume': 12
                                }
                                {
                                    // 'name': 'scale',
                                    'units': 'lb',
                                    'volume': 8
                                }
                            ]
                        }],
                        score: 'amount' // times
                    },
                    'replaceAction':{//只有action.type==movement时才有
                        'name': 'Wall Ball', // 动作名字
                        'equipment': {
                            'name': '器材名字',
                            'icon': 'http://img.leadfit.cn/...'
                        },
                        'reps': 10, // 重复次数
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
                    }
                    'pattern': {
                        
                        'type': 'fix', // var, tabata, emom, amrap
                        'define': { // fix
                            rounds: 3,//轮
                            reps: 15
                        },
                        'define': [ // var
                            21,
                            15,
                            9
                        ],
                        'define': { // tabata
                            execute: 40,//运动
                            rest: 20,//休息
                            rounds: 8//共计轮
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
                    },
                    score: [
                        'time',
                        'times',
                        'amount'
                    ]
                }
            ]
        },
        ...
    ]
},