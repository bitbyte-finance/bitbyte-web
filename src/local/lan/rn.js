/**
 * @File rn
 * @Author nagatoyuki
 * @Date 2021/7/7 - 2:29 下午
 */
export default {
	header: [
		'обмен',
		'Майнинг пул',
		'Совет директоров',
		'Связать кошелек',
		'ферма',
		'Мост'
	],
	header_en: [
		'Swap',
		'Pool',
		'Boardroom',
		'Connect wallet',
		'Farm',
		'Bridge'
	],
	user: {
		connect: [
			'Свяжите свой кошелек！',
			// 'MetaMask',
			'кошелек',
			'новый ',
			'ZBC',
			'Пожалуйста, обратитесь к руководству'
		],
		account: [
			'Аккаунт',
			'Ссылка на кошелек',
			/*'Копировать адрес',
			'Посмотреть HECO',
			'приглашать',*/
			'Copy Address',
			'View on ',
			'Invite',
			'Ваши транзакции появятся здесь ...'
		],
		invite: [
			'Приглашать',
			'Пригласите друзей, чтобы получить награды',
			'Пожалуйста, введите адрес кошелька верхнего уровня',
			'Связывать',
      'Ваш родительский адрес',
      'Скопируйте пригласительную ссылку, поделитесь ею с друзьями, успешно свяжите пригласительные отношения и получите комиссию.',
      'скопируйте ссылку-приглашение',
      'Заполнив пригласительный адрес, он навсегда увеличит доход на 12,5%.',
      '* (Пожалуйста, проконсультируйтесь с сообществом или проверьте плакат, чтобы узнать о доходах)',
      'Успешно скопируйте ссылку-приглашение, поделитесь ею с друзьями, успешно свяжите отношения приглашения и получите майнинг для повторного использования.',
      'Вы не можете привязать свой собственный адрес как вышестоящий.',
      'Этот адрес является вашим подчиненным адресом и не может быть привязан',
    ]
	},
	settings: [
		'Настройки транзакции',
		'Допуск по проскальзыванию',
		'Срок транзакции',
		'минуты',
		'Язык'
	],
	swap: {
		form: [
			'Из',
			'Остаток средств: ',
			'МАКСИМУМ',
			'К'
		],
		select: [
			// "Выбрать токен",
			'Select Token',
			'Выберите токен',
			"Найдите имя или вставьте адрес"
		],
		btn: [
			"Неверная сеть",
			'Недостаточная ликвидность для этой сделки',
			'Вносить количество',
			"Подтвердить обмен",
			'Утвердить ',
			"Все равно поменять местами",
			"Слишком сильное влияние на цену"
		],
		info: [
			'Допуск к проскальзыванию',
			'Допуск текущего проскальзывания',
			'Влияние на цену',
			'Разница между рыночной ценой и вашей ценой из-за размера сделки.',
			'Полученный минимум',
			'Ваша транзакция будет отменена, если произойдет большое неблагоприятное движение цены до ее подтверждения',
			'Платеж'
		],
		confirm: [
			'Подтвердить обмен',
			'Объем производства оценивается. Вы получите как минимум ',
			'или транзакция будет отменена.',
			'цена',
			'Минимум получен:',
			'Торговая комиссия:'
		]
	},
	pool: {
		title: 'Вы можете получить ZBC бесплатно при каждой транзакции!',
		subTitle: 'Создайте крупнейшую экосистему DeFi с интеграцией DEX',
		tab: [
			'Ваша ликвидность',
			'Добавить ликвидность'
		],
		content: {
			add: {
				form: [
					'Вход',
					'Доля пула'
				],
				btn: [
					'Ликвидность',
					'Добавлять',
					'Создавать'
				],
				position: [
					'Твоя позиция',
					"Ваша доля в пуле",
				],
				confirm: {
					s1: [
						'Вы получите',
						'Жетоны пула',
						'Объем производства оценивается. Если цена изменится более чем на ',
						'ваша транзакция будет отменена.',
						'Депонированный',
						'Тарифы',
						'Доля в пуле:',
						'Подтвердить поставку'
					],
					s2: [
						'Ожидание подтверждения...',
						'Подтвердите эту транзакцию в своем кошельке'
					],
					s3: [
						'Транзакция отправлена',
						'Закрывать'
					],
					s4: [
						'Транзакция не удалась',
						'Закрывать'
					]
				}
			},
			your: {
				noData: [
					'Подключиться к кошельку',
					"Коммутатор сети",
					'для просмотра вашей ликвидности.',
					'Ликвидности не обнаружено.'
				],
				colContent: {
					form: [
						'Жетоны вашего пула:',
						'Объединенный',
						'Доля вашего пула:',
						'Адрес договора LP (нажмите, чтобы скопировать)'
					],
					btn: [
						'Удалять',
						'Добавлять'
					]
				}
			},
			remove: {
				title: 'Удалить ликвидность',
				form: [
					'Количество',
					'Цена'
				],
				btn: [
					'Утвердить',
					'Удалять'
				],
				position: [
					'Твоя позиция',
					'Ваша доля в пуле'
				],
				confirm: [
					'Объем производства оценивается. Вы получите',
					'а также',
					'по крайней мере, или транзакция будет отменена.',
					'цена',
					'Подтверждать'
				]
			}
		}
	},
	mining: {
		message: [
			'После майнинга для извлечения требуется время более 24 часов',
			'В процессе майнинга его можно добыть только после получения дохода',
			'шахтный пул открыт только для приглашенного адреса. Пожалуйста, подтвердите, что вы были обязаны участвовать в майнинге, иначе вы не сможете получать доход от майнинга.'
		],
		currency: [
			'Урожай',
			'APY',
			'Депонированный',
			'Интерес',
			'Блокировка',
			'Оставшийся',
			'Время начала',
			'APR',
			'APY',
			'Ежедневное снятие дохода и ручное реинвестирование. Доходность сложных процентов со временем будет становиться все выше и выше.'
		],
		btn: [
			'Утверждаю',
			'Депозит',
			'Вывод',
			'Распределить доход'
		],
		withdraw: {
			normal: [
				'Отзывать',
				'Депонированный',
				'Интерес',
				'Подтверждать'
			],
			s2: [
				'Ожидание подтверждения...',
				'Подтвердите эту транзакцию в своем кошельке'
			],
			s3: [
				'Транзакция отправлена',
				'Закрывать'
			],
			s4: [
				'Транзакция не удалась',
				'Закрывать'
			]
		},
		deposit: {
			normal: [
				'Депозит',
				'Урожай',
				'Остаток средств',
				'Пожалуйста, введите сумму',
				// 'МАКСИМУМ',
				'MAX',
				'Подтверждать'
			]
		}
	},
	toast: [
		'Успешное копирование!',
		'Ошибка копирования!',
		"Подтвердить не удалось",
		"Пожалуйста, выберите количество",
		'Пожалуйста, выберите токен',
		'Недостаточный баланс'
	],
	confirmMessage: [
		'Менять',
		'для'
	],
	alert: {
		point: [
			'Подсказка',
			'Подтверждать'
		],
		warning: [
			'Предупреждение',
			'Сначала авторизуйтесь'
		]
	},
	bridge: {
		bridge: {
			tabs: [
				'Мост',
				"Ваш заработок"
			],
			form: {
				chooseCoinTitle: 'Выберите актив межсетевого моста',
				fromTo: [
					'Из',
					'К',
				],
				address: {
					title: 'Адрес получения',
					placeholder: 'Адрес назначения',
					btn: 'Мой',
					description: [
						'Пожалуйста, введите правильный адрес, неправильный адрес получить НЕВОЗМОЖНО',
						'(Не обменный / контактный адрес)'
					]
				},
				amount: {
					title: 'Количество',
					placeholder: 'Минимальная сумма 10',
					btn: 'MAX',
					balance: 'Баланс'
				},
				btn: [
					'Утвердить',
					'Следующий шаг'
				],
				history: 'История транзакций'
			}
		},
		earn: {
			coinItem: {
				pooled: 'Стороны',
				share: 'Ваша доля в пуле',
				btn: {
					add: 'Добавлять',
					remove: 'Удалять'
				}
			}
		},
		confirmCrossChain: {
			title: 'информация о перекрестной цепи',
			amount: 'Сумма перевода',
			address: 'Адрес получения',
			actual: 'Фактическое прибытие',
			fee: 'платеж',
			description: 'Через мост перекрестных ссылок bitbyte вы получите токен, сопоставленный bitbyte в картографической сети.',
			btn: [
				'Подтверждать',
				'назад'
			]
		},
		removeEarn: {
			title: 'Удалить заработок',
			amount: 'Количество',
			btn: [
				'Утвердить',
				'Удалять'
			],
			share: 'Ваша доля в пуле',
			income: 'Доход'
		},
		addEarn: {
			title: 'Добавить заработать',
			please: 'Пожалуйста, импортируйте токен',
			import: 'Импортировать',
			btn: [
				'Утвердить',
				'Добавить заработать'
			]
		},
		crossChainRecord: {
			title: 'Рекорд кросс-цепочки',
			assets: 'Ресурсы',
			quantity: 'Количество',
			fee: 'Платеж'
		},
		toast: {
			approve: {
				success: 'Подтвердите успех!',
				failure: 'Подтвердить не удалось!',
				allowance: 'Недостаточная авторизация'
			},
			crossChainForm: {
				correctQuantity: 'Пожалуйста, введите правильное количество',
				minimum: 'Минимальная сумма - 10',
				maximum: 'Превышен максимальный лимит'
			},
			crossChain: {
				success: 'Успех кроссчейн!',
				failure: 'Отказ кросс-цепи',
				targetQuota: 'Недостаточная квота целевой цепочки'
			},
			earn: {
				poolQuota: 'Недостаточная квота пула',
				add: {
					success: 'Добавьте заработка успеха!',
					failure: 'Не удалось добавить заработок！'
				},
				remove: {
					success: 'Удалите заработать успех!',
					failure: 'Снять заработать не удалось!'
				}
			}
		}
	}
}