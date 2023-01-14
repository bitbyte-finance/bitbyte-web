/**
 * @File en
 * @Author nagatoyuki
 * @Date 2021/6/30 - 11:03 上午
 */
export default {
	header: [
		'Swap',
		'Pool',
		'Boardroom',
		'Connect wallet',
		'Farm',
		'Bridge'
	],
	user: {
		connect: [
			'Connect your wallet！',
			// 'MetaMask',
			'Wallet',
			'New to ',
			'ZBC',
			'Please see the guideline'
		],
		account: [
			'Account',
			// 'Connected with MetaMask',
			'Connected with Wallet',
			'Copy Address',
			'View on ',
			'Invite',
			'Your transactions will appear here…'
		],
		invite: [
			'Invite',
			'Invite friends to get rewards',
			'Please enter the wallet address of the superior',
			'Bind',
      'Your superior address',
      'Copy the invitation link, share it with your friends, bind the invitation relationship successfully, and get it for reuse.',
      'copy the inivitation link',
      'After filling in the invitation address, it will permanently increase the income by 12.5%',
      '*(Please consult the community or check the poster for details of the income)',
      'Copy invitation link successfully, share it with friends, bind invitation relationship successfully, and get mining for reuse.',
      'You cannot bind your own address as a superior address',
      'The address is your subordinate address and cannot be bound',
		]
	},
	settings: [
		'Transaction Settings',
		'Slippage tolerance',
		'Transaction deadline',
		'minutes',
		'Language'
	],
	swap: {
		inviteBanner: [
			'Fill in the address of the inviter to get excessive income',
			'bind'
		],
		form: [
			'From',
			'Balance: ',
			'MAX',
			'To'
		],
		select: [
			'Select Token',
			'Select a token',
			'Search name or paste address'
		],
		btn: [
			'Wrong Network',
			'Insufficient liquidity for this trade',
			'Enter amount',
			'Confirm Swap',
			'Approve ',
			'Swap Anyway',
			'Price Impact Too High'
		],
		info: [
			'Slippage Tolerance',
			'Current Slippage Tolerance',
			'Price Impact',
			'The difference between the market price and your price due to trade size.',
			'Minimum received',
			'Your transaction will revert if there is a large unfavorable price movement before it is confirmed',
			'Fee'
		],
		confirm: [
			'Confirm Swap',
			'Output is estimated. You will receive at least',
			'or the transaction will revert.',
			'price',
			'Minimum received:',
			'Trade Fee:'
		]
	},
	pool: {
		title: 'With free ZBC on every trade, fees are free!',
		subTitle: 'Create the largest DeFi ecosystem integrating DEX',
		tab: [
			'Your liquidity',
			'Add liquidity'
		],
		content: {
			add: {
				form: [
					'Input',
					'Share of pool'
				],
				btn: [
					'Liquidity',
					'Add',
					'Create'
				],
				position: [
					'Your position',
					'Your pool share',
				],
				confirm: {
					s1: [
						'You will receive',
						'Pool Tokens',
						'Output is estimated. If the price changes by more than ',
						' your transaction will revert.',
						'Deposited',
						'Rates',
						'Share of Pool:',
						'Confirm Supply'
					],
					s2: [
						'Waiting For Confirmation...',
						'Confirm this transaction in your wallet'
					],
					s3: [
						'Transaction has been submitted',
						'Close'
					],
					s4: [
						'Transaction failed',
						'Close'
					]
				}
			},
			your: {
				noData: [
					'Connect to a wallet',
					'Switch Network',
					'to view your liquidity.',
					'No liquidity found.'
				],
				colContent: {
					form: [
						'Your pool tokens:',
						'Pooled',
						'Your pool share:',
						'LP contract address (click to copy)'
					],
					btn: [
						'Remove',
						'Add'
					]
				}
			},
			remove: {
				title: 'Remove Liquidity',
				form: [
					'Amount',
					'Price'
				],
				btn: [
					'Approve',
					'Remove'
				],
				position: [
					'Your position',
					'Your pool share'
				],
				confirm: [
					'Output is estimated. You will receive',
					'and',
					'at least  or the transaction will revert.',
					'price',
					'Confirm'
				]
			}
		}
	},
	mining: {
		message: [
			'After mining to extract the time required more than 24 hours',
			'In the process of mining, it can only be extracted after the income is generated',
			'mine pool is only open to the invited address. Please confirm that you have been bound by the superior to participate in the mining, otherwise you will not be able to obtain mining income.'
		],
		currency: [
			'Harvest',
			'APY',
			'Deposited',
			'Interest',
			'Locking',
			'Remaining',
			'Start time',
			'APR',
			'APY',
			'Daily income withdrawal and manual reinvestment.The return on compound interest will get higher and higher over time.'
		],
		btn: [
			'Approving',
			'Deposit',
			'Withdrawal',
			'Distribute income'
		],
		withdraw: {
			normal: [
				'Withdraw',
				'Deposited',
				'Interest',
				'Confirm'
			],
			s2: [
				'Waiting For Confirmation...',
				'Confirm this transaction in your wallet'
			],
			s3: [
				'Transaction has been submitted',
				'Close'
			],
			s4: [
				'Transaction failed',
				'Close'
			]
		},
		deposit: {
			normal: [
				'Deposit',
				'Harvest',
				'Balance',
				'Please enter amount',
				'MAX',
				'Confirm'
			]
		}
	},
	toast: [
		'Copy Success!',
		'Copy Error!',
		'Approve Failed',
		'Please select the quantity',
		'Please select token',
		'Insufficient balance'
	],
	confirmMessage: [
		'Swap',
		'for'
	],
	alert: {
		point: [
			'Point',
			'Confirm'
		],
		warning: [
			'Warning',
			'Please authorize first'
		]
	},
	bridge: {
		bridge: {
			tabs: [
				'Bridge',
				'Your Earn'
			],
			form: {
				chooseCoinTitle: 'Choose the cross-chain bridge asset',
				fromTo: [
					'From',
					'To',
				],
				address: {
					title: 'Receiving address',
					placeholder: 'Destination address',
					btn: 'Mine',
					description: [
						'Please enter the correct address, wrong address will UNABLE to receive',
						'(Not the exchange/contact address)'
					]
				},
				amount: {
					title: 'Amount',
					placeholder: 'Minimum amount is 10',
					btn: 'MAX',
					balance: 'Balance'
				},
				btn: [
					'Approve',
					'Next Step'
				],
				history: 'Transaction History'
			}
		},
		earn: {
			coinItem: {
				pooled: 'Pooled',
				share: 'Your pool share',
				btn: {
					add: 'Add',
					remove: 'Remove'
				}
			}
		},
		confirmCrossChain: {
			title: 'Confirm cross chain information',
			amount: 'Transfer amount',
			address: 'Collection address',
			actual: 'Actual arrival',
			fee: 'fee',
			description: 'Through the bitbyte cross link bridge, you will receive the token mapped by bitbyte in the mapping network',
			btn: [
				'Confirm',
				'back'
			]
		},
		removeEarn: {
			title: 'Remove Earn',
			amount: 'Amount',
			btn: [
				'Approve',
				'Remove'
			],
			share: 'Your Pool Share',
			income: 'Income'
		},
		addEarn: {
			title: 'Add Earn',
			please: 'Please import Token',
			import: 'import',
			btn: [
				'Approve',
				'Add Earn'
			]
		},
		crossChainRecord: {
			title: 'Cross chain record',
			assets: 'Quantity',
			quantity: 'Quantity',
			fee: 'Fee'
		},
		toast: {
			approve: {
				success: 'Approve Success!',
				failure: 'Approve Failed!',
				allowance: 'Insufficient authorization'
			},
			crossChainForm: {
				correctQuantity: 'Please enter the correct quantity',
				minimum: 'The minimum amount is 10',
				maximum: 'The maximum limit has been exceeded'
			},
			crossChain: {
				success: 'Cross-chain success!',
				failure: 'Cross-chain failure',
				targetQuota: 'Insufficient target chain quota'
			},
			earn: {
				poolQuota: 'Insufficient pool quota',
				add: {
					success: 'Add earn success!',
					failure: 'Add earn failed！'
				},
				remove: {
					success: 'Remove earn success!',
					failure: 'Remove earn failed!'
				}
			}
		}
	},
	footer: {
		listingToken: 'Listing Token'
	}
}