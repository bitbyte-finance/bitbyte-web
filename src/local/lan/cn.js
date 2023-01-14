/**
 * @File cn
 * @Author nagatoyuki
 * @Date 2021/6/30 - 5:35 下午
 */
export default {
	header: [
		'兌換',
		'流動池',
		'董事會',
		'鏈接錢包',
		'流動性挖礦',
		'跨鏈橋'
	],
	user: {
		connect: [
			'鏈接您的錢包！',
			// 'MetaMask',
			'錢包',
			'新的 ',
			'ZBC',
			'請參閱指南'
		],
		account: [
			'賬戶',
			// '鏈接MetaMask',
			'鏈接錢包',
			'複製地址',
			'查看',
			'邀請',
			'您的交易將顯示在此處…'
		],
		invite: [
			'邀請',
			'邀請好友領取獎勵',
			'請輸入上級的錢包地址',
			'綁定',
      '您的上級地址',
      '複製邀請鏈接，分享給好友成功綁定邀請關係，可獲取挖礦返佣。',
      '複製邀請鏈接',
      '填寫邀請地址後，永久增加挖礦收益12.5%',
      '*（具體收入請諮詢社區或查看海報）',
      '複製邀請鏈接成功，分享給好友成功邀請邀請關係，可獲取挖礦返佣',
      '您不能將自己的地址綁定為上級地址',
      '此地址是您的下級地址，無法關聯'
		]
	},
	settings: [
		'交易設置',
		'滑點差值',
		'交易截止日期',
		'分鐘',
		'語言'
	],
	swap: {
		inviteBanner: [
			'填写邀请人地址，获取超额收益',
			'綁定'
		],
		form: [
			'從',
			'資金: ',
			'最大',
			'至'
		],
		select: [
			'選擇交易對',
			'選擇一個幣種',
			'搜索名稱或粘貼地址'
		],
		btn: [
			'錯誤的網絡',
			'這筆交易的流動性不足',
			'輸入金額',
			'確認交易',
			'授權',
			'無論如何交換',
			'價格影響很高'
		],
		info: [
			'滑點差值',
			'當前滑點',
			'價格影響',
			'市場價格與你方價格因交易規模而產生的差額。',
			'最低收到',
			'如果在確認前價格有較大的不利變動，您的交易將恢復',
			'手續費'
		],
		confirm: [
			'確認交易',
			'估計輸出。 您將至少收到',
			', 否則交易將恢復。',
			'價格',
			'最低收到：',
			'手續費：'
		]
	},
	pool: {
		title: '每筆交易都可免費獲得ZBC！',
		subTitle: '創建最大的DeFi生態系統集成DEX',
		tab: [
			'你的流動性',
			'新增流動性'
		],
		content: {
			add: {
				form: [
					'輸入',
					'池份額'
				],
				btn: [
					'流動性',
					'新增',
					'創建'
				],
				position: [
					'你的位置',
					'你的池份額',
				],
				confirm: {
					s1: [
						'你會得到',
						'Pool Tokens',
						'估計產量。如果價格變化超過 ',
						' 您的交易將恢復',
						'存款',
						'費率',
						'池份額：',
						'確認提供'
					],
					s2: [
						'正在等待確認......',
						'在您的錢包中確認此交易'
					],
					s3: [
						'交易已提交',
						'關閉'
					],
					s4: [
						'交易失敗',
						'關閉'
					]
				}
			},
			your: {
				noData: [
					'連接到一個錢包',
					'切換網絡',
					'查看您的流動性',
					'未發現流動性.'
				],
				colContent: {
					form: [
						'你的流動池代幣:',
						'流動池',
						'你的池份額:',
						'LP合约地址(点击复制)'
					],
					btn: [
						'删除',
						'添加'
					]
				}
			},
			remove: {
				title: '消除流動性',
				form: [
					'數量',
					'價格'
				],
				btn: [
					'授權',
					'删除'
				],
				position: [
					'你的位置',
					'你的池份額'
				],
				confirm: [
					'估計輸出。 您將至少收到',
					'和',
					'，否則交易將恢復。',
					'價格',
					'確認'
				]
			}
		}
	},
	mining: {
		message: [
			'開採後提取所需時間超過24小時',
			'在開採過程中，只有產生收益後才能開採',
			'礦坑只對受邀的地址開放。請確認您已被上級約束參與開採，否則將無法獲得開採收入。'
		],
		currency: [
			'收穫',
			'預計年化率',
			'存款',
			'利息',
			'鎖定',
			'剩下的',
			'開始時間',
			'單利年化',
			'複利年化',
			'每日將收益提取，進行手動复投，隨著時間的增加複利收益將會越來越高。'
		],
		btn: [
			'準予',
			'存放',
			'提取',
			'分配收入'
		],
		withdraw: {
			normal: [
				'提取',
				'存款',
				'利息',
				'確認'
			],
			s2: [
				'正在等待確認......',
				'在您的錢包中確認此交易'
			],
			s3: [
				'交易已提交',
				'關閉'
			],
			s4: [
				'交易失敗',
				'關閉'
			]
		},
		deposit: {
			normal: [
				'存放',
				'收穫',
				'餘額',
				'請輸入金額',
				'最大',
				'確認'
			]
		}
	},
	toast: [
		'複製成功!',
		'複製失敗!',
		'授權失敗',
		'請輸入數量',
		'請選擇幣種',
		'餘額不足'
	],
	confirmMessage: [
		'將',
		'換成'
	],
	alert: {
		point: [
			'提示',
			'確認'
		],
		warning: [
			'警告',
			'請先授權'
		]
	},
	bridge: {
		bridge: {
			tabs: [
				'跨鏈',
				'流動性'
			],
			form: {
				chooseCoinTitle: '選擇跨鏈資產',
				fromTo: [
					'從',
					'到',
				],
				address: {
					title: '收幣地址',
					placeholder: '目的地址',
					btn: '我的',
					description: [
						'請輸入正確的地址，錯誤的地址將無法接收',
						'(不是交易所/合約地址)'
					]
				},
				amount: {
					title: '數量',
					placeholder: '最小數量為 10',
					btn: '最大',
					balance: '餘額'
				},
				btn: [
					'授權',
					'下一步'
				],
				history: '交易記錄'
			}
		},
		earn: {
			coinItem: {
				pooled: '池子總',
				share: '你的池子份額',
				btn: {
					add: '增加',
					remove: '提走'
				}
			}
		},
		confirmCrossChain: {
			title: '確認跨鏈信息',
			amount: '轉賬金額',
			address: '目標地址',
			actual: '實際到賬',
			fee: '手續費',
			description: '通過bitbyte 跨鏈橋接，您將在映射網絡中收到bitbyte 映射的token',
			btn: [
				'確認',
				'返回'
			]
		},
		removeEarn: {
			title: '刪除流動性',
			amount: '數量',
			btn: [
				'授權',
				'刪除'
			],
			share: '你的池份額',
			income: '收益'
		},
		addEarn: {
			title: '增加流動性',
			please: '請導入代幣',
			import: '進口',
			btn: [
				'授權',
				'增加流動性'
			]
		},
		crossChainRecord: {
			title: '跨鏈記錄',
			assets: '資產',
			quantity: '數量',
			fee: '費用'
		},
		toast: {
			approve: {
				success: '授權成功!',
				failure: '授權失敗!',
				allowance: '授權額度不足'
			},
			crossChainForm: {
				correctQuantity: '請輸入正確的數量',
				minimum: '最低數量為 10',
				maximum: '已超過最大限制'
			},
			crossChain: {
				success: '跨鏈成功！',
				failure: '跨鏈錯誤',
				targetQuota: '目標鏈額度不足'
			},
			earn: {
				poolQuota: '代幣池額度不足',
				add: {
					success: '添加流動性成功!',
					failure: '添加流動性失敗！'
				},
				remove: {
					success: '刪除流動性成功!',
					failure: '刪除流動性失敗!'
				}
			}
		}
	},
	footer: {
		listingToken: '上市代幣'
	}
}