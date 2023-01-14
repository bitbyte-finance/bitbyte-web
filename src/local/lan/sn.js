/**
 * @File sn
 * @Author nagatoyuki
 * @Date 2021/7/7 - 10:51 上午
 */
export default {
	header: [
		'intercambio',
		'Pool de minería',
		'Junta Directiva',
		'Billetera de enlace',
		'granja'
	],
	user: {
		connect: [
			'Vincula tu billetera！',
			'MetaMask',
			'nuevo ',
			'ZBC',
			'Por favor, consulte la guía.'
		],
		account: [
			'Cuenta',
			'Conectado con MetaMask',
			'Copiar dirección',
			'Ver en ',
			'Invitación',
			'Sus transacciones aparecerán aquí ...'
		],
		invite: [
			'Invitación',
			'Invita a tus amigos para obtener recompensas',
			'Por favor ingrese la dirección de billetera del subordinado',
			'Unir'
		]
	},
	settings: [
		'Configuración de transacciones',
		'Tolerancia al deslizamiento',
		'Fecha límite de transacción',
		'minutos',
		'Idioma'
	],
	swap: {
		form: [
			'De',
			'Equilibrio: ',
			'MAX',
			'A'
		],
		select: [
			'Seleccionar token',
			'Seleccione un token',
			'Buscar nombre o pegar dirección'
		],
		btn: [
			'Red incorrecta',
			'Liquidez insuficiente para esta operación',
			'Ingrese monto',
			'Confirmar intercambio',
			'Aprobar',
			'Swap Anyway',
			'Impacto de precio demasiado alto'
		],
		info: [
			'Tolerancia al deslizamiento',
			'Tolerancia al deslizamiento actual',
			'Impacto en el precio',
			'La diferencia entre el precio de mercado y su precio debido al tamaño de la operación.',
			'Mínimo recibido',
			'Su transacción se revertirá si hay un gran movimiento de precios desfavorable antes de que se confirme',
			'Tarifa'
		],
		confirm: [
			'Confirmar intercambio',
			'La producción es estimada. Recibirás al menos ',
			'o la transacción se revertirá.',
			'precio',
			'Mínimo recibido:',
			'Tarifa comercial:'
		]
	},
	pool: {
		title: '¡Puede obtener ZBC gratis con cada transacción!',
		subTitle: 'Cree el ecosistema DeFi más grande integrando DEX',
		tab: [
			'Tu liquidez',
			'Agregar liquidez'
		],
		content: {
			add: {
				form: [
					'Aporte',
					'Participación de la piscina'
				],
				btn: [
					'Liquidez',
					'Agregar',
					'Crear'
				],
				position: [
					'Tu posición',
					'Tu parte de la piscina',
				],
				confirm: {
					s1: [
						'Usted recibirá',
						'Pool Tokens',
						'La producción es estimada. Si el precio cambia en más de ',
						'su transacción se revertirá.',
						'Depositado',
						'Tarifas',
						'Participación del grupo:',
						'Confirmar suministro'
					],
					s2: [
						'Esperando confirmación...',
						'Confirme esta transacción en su billetera'
					],
					s3: [
						'La transacción ha sido enviada',
						'Cerca'
					],
					s4: [
						'Transacción fallida',
						'Cerca'
					]
				}
			},
			your: {
				noData: [
					'Conectarse a una billetera',
					'Cambiar de red',
					'para ver su liquidez.',
					'No se encontró liquidez.'
				],
				colContent: {
					form: [
						'Tus tokens de piscina:',
						'Pooled',
						'Su participación en la piscina:'
					],
					btn: [
						'Eliminar',
						'Agregar'
					]
				}
			},
			remove: {
				title: 'Eliminar liquidez',
				form: [
					'Monto',
					'Precio'
				],
				btn: [
					'Aprobar',
					'Eliminar'
				],
				position: [
					'Tu posición',
					'Tu parte de la piscina'
				],
				confirm: [
					'La producción es estimada. Usted recibirá',
					'y',
					'al menos o la transacción se revertirá.',
					'precio',
					'Confirmar'
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
	}
}