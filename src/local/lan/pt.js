/**
 * @File pt
 * @Author nagatoyuki
 * @Date 2021/7/6 - 7:36 下午
 */
export default {
	header: [
		'intercâmbio',
		'Piscina de mineração',
		'Conselho Administrativo',
		'carteira ligação',
		'Fazenda',
		'Ponte'
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
			'Vincule sua carteira！',
			// 'MetaMask',
			'carteira',
			'novo ',
			'ZBC',
			'Por favor, consulte o guia'
		],
		account: [
			'Conta',
			// 'Link para MetaMask',
			'Link para carteira',
			'Copiar endereço',
			'Ver ',
			'Convidar',
			'Suas transações aparecerão aqui ...'
		],
		invite: [
			'Convidar',
			'Convide amigos para obter recompensas',
			'Por favor, insira o endereço da carteira de nível superior',
			'Ligar',
      'Seu endereço superior',
      'Copie o link do convite, compartilhe-o com amigos, vincule a relação de convite com sucesso e receba a comissão de mineração.',
      'copie o link do convite',
      'Após preencher o endereço do convite, aumentará permanentemente a receita em 12,5%',
      '* (Consulte a comunidade ou verifique o pôster para obter detalhes sobre a receita)',
      'Copie o link de convite com sucesso, compartilhe-o com amigos, vincule o relacionamento de convite com sucesso e obtenha mineração para reutilização.',
      'Você não pode vincular seu próprio endereço como um endereço superior',
      'Este é o endereço do seu subordinado e não pode ser vinculado.',
    ]
	},
	settings: [
		'Configurações de transação',
		'Tolerância ao deslizamento',
		'Prazo da transação',
		'minutos',
		'Língua'
	],
	swap: {
		form: [
			'A partir de',
			'Equilíbrio: ',
			'MAX',
			'Para'
		],
		select: [
			// 'Selecionar Token',
			'Select Token',
			'Selecione um token',
			'Pesquisar nome ou colar endereço'
		],
		btn: [
			'Rede errada',
			'Liquidez insuficiente para este comércio',
			'Digite o valor',
			'Confirmar troca',
			'Aprovar',
			'Trocar de qualquer maneira',
			'Impacto de preço muito alto'
		],
		info: [
			'Tolerância à derrapagem',
			'Tolerância de deslizamento atual',
			'Impacto do preço',
			'A diferença entre o preço de mercado e seu preço devido ao tamanho da negociação.',
			'Mínimo recebido',
			'Sua transação será revertida se houver um grande movimento de preço desfavorável antes de ser confirmado',
			'Taxa'
		],
		confirm: [
			'Confirmar troca',
			'A produção é estimada. Você receberá pelo menos ',
			'ou a transação será revertida.',
			'preço',
			'Mínimo recebido:',
			'Taxa de negociação:'
		]
	},
	pool: {
		title: 'Você pode obter o ZBC gratuitamente em todas as transações!',
		subTitle: 'Crie o maior ecossistema DeFi integrando DEX',
		tab: [
			'Sua liquidez',
			'Adicionar liquidez'
		],
		content: {
			add: {
				form: [
					'Entrada',
					'Participação da piscina'
				],
				btn: [
					'Liquidez',
					'Adicionar',
					'Crio'
				],
				position: [
					'Sua posição',
					'Sua participação na piscina',
				],
				confirm: {
					s1: [
						'Você receberá',
						'Pool Tokens',
						'A produção é estimada. Se o preço mudar em mais de ',
						'sua transação será revertida.',
						'Depositado',
						'Cotações',
						'Participação da piscina:',
						'Confirmar Fornecimento'
					],
					s2: [
						'Aguardando confirmação ...',
						'Confirme esta transação em sua carteira'
					],
					s3: [
						'A transação foi enviada',
						'Perto'
					],
					s4: [
						'Falha na transação',
						'Perto'
					]
				}
			},
			your: {
				noData: [
					'Conectar a uma carteira',
					'Mudar de rede',
					'para ver a sua liquidez.',
					'Nenhuma liquidez encontrada.'
				],
				colContent: {
					form: [
						'Seus tokens de pool:',
						'Pooled',
						'Sua participação na piscina:',
						'Endereço do contrato LP (clique para copiar)'
					],
					btn: [
						'Remover',
						'Adicionar'
					]
				}
			},
			remove: {
				title: 'Remover Liquidez',
				form: [
					'Resultar',
					'Preço'
				],
				btn: [
					'Aprovar',
					'Remover'
				],
				position: [
					'Sua posição',
					'Sua participação na piscina'
				],
				confirm: [
					'A produção é estimada. Você receberá',
					'e',
					'pelo menos ou a transação será revertida.',
					'preço',
					'Confirme'
				]
			}
		}
	},
	mining: {
		message: [
			'Após a mineração para extrair o tempo necessário mais de 24 horas',
			'No processo de mineração, ele só pode ser extraído após a geração da renda',
			'meu pool está aberto apenas para o endereço do convidado. Por favor, confirme que você foi obrigado pelo superior a participar da mineração, caso contrário, você não será capaz de obter rendimentos de mineração.'
		],
		currency: [
			'Colheita',
			'APY',
			'Depositado',
			'Interesse',
			'Bloqueio',
			'Remanescente',
			'Hora de início',
			'APR',
			'APY',
			'Retirada de renda diária e reinvestimento manual. O retorno sobre os juros compostos ficará cada vez mais alto com o tempo.'
		],
		btn: [
			'Aprovando',
			'Depósito',
			'Cancelamento',
			'Distribuir renda'
		],
		withdraw: {
			normal: [
				'Retirar',
				'Depositado',
				'Interesse',
				'Confirme'
			],
			s2: [
				'Aguardando confirmação ...',
				'Confirme esta transação em sua carteira'
			],
			s3: [
				'A transação foi enviada',
				'Perto'
			],
			s4: [
				'Falha na transação',
				'Perto'
			]
		},
		deposit: {
			normal: [
				'Depósito',
				'Colheita',
				'Equilíbrio',
				'Por favor, insira o valor',
				'MAX',
				'Confirme'
			]
		}
	},
	toast: [
		'Copiar com sucesso!',
		'Erro de cópia!',
		'Aprovação falhou',
		'Selecione a quantidade',
		'Selecione o token',
		'Saldo insuficiente'
	],
	confirmMessage: [
		'Trocar',
		'para'
	],
	alert: {
		point: [
			'incitar',
			'Confirme'
		],
		warning: [
			'Aviso',
			'Por favor, autorize primeiro'
		]
	},
	bridge: {
		bridge: {
			tabs: [
				'Ponte',
				'Seu ganho'
			],
			form: {
				chooseCoinTitle: 'Escolha o ativo de ponte de cadeia cruzada',
				fromTo: [
					'A partir de',
					'Para',
				],
				address: {
					title: 'Endereço de recebimento',
					placeholder: 'Endereço de destino',
					btn: 'minha',
					description: [
						'Por favor, digite o endereço correto, o endereço errado NÃO POSSUI receber',
						'(Não é o endereço de troca / contato)'
					]
				},
				amount: {
					title: 'Quantia',
					placeholder: 'O valor mínimo é 10',
					btn: 'MAX',
					balance: 'Equilíbrio'
				},
				btn: [
					'Aprovar',
					'Próxima Etapa'
				],
				history: 'Histórico de transações'
			}
		},
		earn: {
			coinItem: {
				pooled: 'As festas',
				share: 'Seu compartilhamento de piscina',
				btn: {
					add: 'Adicionar',
					remove: 'Remover'
				}
			}
		},
		confirmCrossChain: {
			title: 'Confirme as informações da cadeia cruzada',
			amount: 'Valor da transferência',
			address: 'Endereço de coleta',
			actual: 'Chegada real',
			fee: 'taxa',
			description: 'Através da ponte de ligação cruzada bitbyte, você receberá o token mapeado pelo bitbyte na rede de mapeamento',
			btn: [
				'confirme',
				'voltar'
			]
		},
		removeEarn: {
			title: 'Remove Earn',
			amount: 'Quantia',
			btn: [
				'Aprovar',
				'Remover'
			],
			share: 'Sua participação na piscina',
			income: 'Renda'
		},
		addEarn: {
			title: 'Adicionar Ganhe',
			please: 'Por favor, importe o token',
			import: 'importar',
			btn: [
				'Aprovar',
				'Adicionar Ganhe'
			]
		},
		crossChainRecord: {
			title: 'Registro de cadeia cruzada',
			assets: 'ativos',
			quantity: 'Quantidade',
			fee: 'Taxa'
		},
		toast: {
			approve: {
				success: 'Aprovar o sucesso!',
				failure: 'Falha na aprovação!',
				allowance: 'Autorização insuficiente'
			},
			crossChainForm: {
				correctQuantity: 'Por favor, insira a quantidade correta',
				minimum: 'O valor mínimo é 10',
				maximum: 'O limite máximo foi excedido'
			},
			crossChain: {
				success: 'Sucesso cross-chain!',
				failure: 'Falha de cadeia cruzada',
				targetQuota: 'Cota de cadeia de destino insuficiente'
			},
			earn: {
				poolQuota: 'Cota de pool insuficiente',
				add: {
					success: 'Adicione ganhar sucesso!',
					failure: 'Adicionar ganho falhou！'
				},
				remove: {
					success: 'Remova o ganho de sucesso!',
					failure: 'Falha ao remover ganho!'
				}
			}
		}
	}
}