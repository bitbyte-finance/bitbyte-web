/**
 * @File BridgeContract
 * @Author nagatoyuki
 * @Date 2021/7/14 - 5:45 下午
 */
import ercAbi from './abi.json'
const abi = ercAbi.abi
let web3 = new Web3(window.ethereum)
// const web3 = new Web3(new Web3.providers.HttpProvider(providersUrl))  // 用网络链路创建web3对象

const httpChainProvider = {
	dev: {
		heco: 'https://http-testnet.hecochain.com',
		bsc: 'https://data-seed-prebsc-1-s1.binance.org:8545'
	},
	prod: {
		heco: 'https://http-mainnet.hecochain.com',
		bsc: 'https://bsc-dataseed1.binance.org'
	}
}

// 获取池子等信息的合约abi
const factoryContractAbi = abi.bridge_factory
const routerContractAbi = abi.bridge_router
const usdtContractAbi = abi.usdt

export class BridgeContract {

	// 合约对象

	//heco合约对象
	hecoContract = {
		factory: {},
		router: {}
	}

	bscContract = {
		factory: {},
		router: {}
	}
	factoryContract // 工厂合约，查池子等操作
	routerContract  // 路由合约，做跨链、流动性等操作
	usdtContract  // 授权等操作
	toFactoryContract // 跨链时要用到，比如跨链时查询跨过去的那个链的池子余额
	toRouterContract

	pairsLength = 0 // 池子数量
	allPairs = [] // 所有池子的hash值
	coinHashList = []
	coinList = [] // 所有的代币信息
	eventList = {}  // 订阅列表
	currentApproveHash  // 当前授权的hash

	constructor(contractAddress) {
		this.factoryContract = new web3.eth.Contract(factoryContractAbi, contractAddress)
		this.getAllPairsLength()  // 获取池子数量
	}

	/**
	 * 订阅方法
	 */
	on (name, fn) {
		// 先检查事件名是否已经有了，有就直接push，否则就初始化并push
		(this.eventList[name] || (this.eventList[name] = [])).push(fn)
	}

	/**
	 * 通知方法
	 */
	emit () {
		let this_ = this
		let eventName = [...arguments].shift()
		let fns = [...this.eventList[eventName]]
		if (!fns || fns.length === 0) {
			return false
		}
		fns.forEach(fn => {
			fn.apply(this_, arguments)
		})
		return this_
	}

	/**
	 * 创建路由合约对象
	 * @param contractAddress 合约地址
	 */
	createRouterContract (contractAddress) {
		if (!this.routerContract) {
			this.routerContract = new web3.eth.Contract(routerContractAbi, contractAddress)
		}
		return this.routerContract
	}

	/**
	 * 创建usdt合约对象
	 * @param coinAddress 代币地址
	 * @returns {*}
	 */
	createUsdtContract (coinAddress) {
		// 如果没有usdt合约对象或者合约对象的地址与传参不同，则新建合约对象
		if (!this.usdtContract || coinAddress !== this.usdtContract._address) {
			this.usdtContract = new web3.eth.Contract(usdtContractAbi, coinAddress)
		}
		return this.usdtContract
	}

	/**
	 * 创建To工厂合约对象
	 * @param contractAddress 合约地址
	 * @param chainId 链id
	 * @returns {*}
	 */
	createToFactoryContract (contractAddress, chainId) {
		if (!this.toFactoryContract) {
			let providersUrl = ''
			switch (chainId) {
				case 256:
					providersUrl = httpChainProvider.dev.heco
					break
				case 97:
					providersUrl = httpChainProvider.dev.bsc
					break
				case 128:
					providersUrl = httpChainProvider.prod.heco
					break
				case 56:
					providersUrl = httpChainProvider.prod.bsc
					break
				default:
					break
			}
			let web3 = new Web3(new Web3.providers.HttpProvider(providersUrl))
			this.toFactoryContract = new web3.eth.Contract(factoryContractAbi, contractAddress)
		}
		return this.toFactoryContract
	}

	/**
	 * 创建To路由合约对象
	 * @param contractAddress 合约地址
	 * @param chainId 链id
	 * @returns {*}
	 */
	createToRouterContract (contractAddress, chainId) {
		if (!this.toRouterContract) {
			let providersUrl = ''
			switch (chainId) {
				case 256:
					providersUrl = httpChainProvider.dev.heco
					break
				case 97:
					providersUrl = httpChainProvider.dev.bsc
					break
				case 128:
					providersUrl = httpChainProvider.prod.heco
					break
				case 56:
					providersUrl = httpChainProvider.prod.bsc
					break
				default:
					break
			}
			let web3 = new Web3(new Web3.providers.HttpProvider(providersUrl))
			this.toRouterContract = new web3.eth.Contract(routerContractAbi, contractAddress)
		}
		return this.toRouterContract
	}

	/**
	 * 获取池子数量
	 * @param instance_ 要调用的合约对象名称，必须是class顶部声明的那几个合约对象之一
	 */
	getAllPairsLength (instance_) {
		this.coinHashList = []

		return new Promise((resolve, reject) => {
			this[instance_ || 'factoryContract'].methods.allPairsLength().call((err, res) => {
				if (!err) {
					if (!instance_) {
						this.pairsLength = Number(res)

						for (let i = 0; i < Number(res); i++) {  // 再遍历获取池子的地址
							this.getAllPairs(i, instance_)
						}
					}
					resolve(res)
				} else {
					reject(err)
				}
			})
		})
	}

	/**
	 * 获取某个池子的hash值
	 * @param index 池子的索引
	 * @param instance_ 要调用的合约对象名称，必须是class顶部声明的那几个合约对象之一
	 */
	getAllPairs (index, instance_) {
		return new Promise((resolve, reject) => {
			this[instance_ || 'factoryContract'].methods.allPairs(index).call((err, res) => {
				if (!err) {
					// this.allPairs.push(res)
					this.getRealPair(res, instance_)
						.then(token => {
							resolve(token)
						})
				} else {
					reject(err)
				}
			})
		})
	}

	/**
	 * 获取代币token/代币地址
	 * @param address
	 * @param instance_ 要调用的合约对象名称，必须是class顶部声明的那几个合约对象之一
	 */
	getRealPair (address, instance_) {
		return new Promise((resolve, reject) => {
			this[instance_ || 'factoryContract'].methods.getRealPair(address).call((err, res) => {
				if (err) {
					reject(err)
				} else {
					if (!instance_) {
						this.getCoinInfo(res)
					}
					this.coinHashList.push(res)
					resolve(res)
				}
			})
		})
	}

	/**
	 * 根据代币token查询代币信息
	 * @param address 代币地址
	 */
	getCoinInfo (address) {
		web3.eth.getCode(address)
			.then(res => {
				if (res === '0x') { // 等于 0x 就表示这不是一个代币
					return false
				}
				let contract = new web3.eth.Contract(abi.usdt, address)
				Promise.all([ contract.methods.symbol().call(),
					contract.methods.decimals().call(),
					contract.methods.totalSupply().call(),
					contract.methods.balanceOf(window.ethereum.selectedAddress).call(),
					contract.methods.name().call(),
				])
					.then(values => {
						console.log(values)
						this.coinList.push({
							address: address,
							name: values[0],
							decimals: values[1],
							totalSupply: values[2],
							balance: values[3],
							icon: 'unknown'
						})
						if (this.coinList.length === this.pairsLength) {
							this.emit('completeCoinList', this.coinList)
						}
					})
					.catch(e => {
						return false
					})
			})
	}

	/**
	 * 授权
	 * @param contractAddress 合约地址
	 * @param accountAddress 当前登录钱包账户地址
	 */
	approve (contractAddress, accountAddress) {
		let num =  '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
		return new Promise((resolve, reject) => {
			this.usdtContract.methods.approve(contractAddress, num)
				.send(
					{ from: window.ethereum.selectedAddress },
					(err, res) => {
						if (err) {//授权失败
							reject(err)
							// this.$toast(this.$t('toast[2]'))
						} else {//成功发起授权，需轮询授权结果
							this.currentApproveHash = res
							resolve(res)
						}
					}
				)
		})
	}

	/**
	 * 轮询授权状态
	 * @returns {Promise<Object>}
	 */
	receipt (hash) {
		return new Promise((resolve, reject) => {
			web3.eth.getTransactionReceipt(hash || this.currentApproveHash ,(err,res) => {
				if (err) {
					reject({
						code: 400,
						meg: 'Failed to query chain information'
					})
				}

				if (res) {
					resolve({
						code: 200, // 已完成状态
						msg: res.status, // "0x1":成功，"0x0"失败
						data: res
					})
				} else {
					reject({
						code: 202, // padding状态，继续轮询
						data: 'padding'
					})
				}
			})
		})
	}

	/**
	 * 获取授权限额
	 * @param allowanceAddress  授权的合约地址
	 * @returns {Promise<Number | String>}
	 */
	getAllowance (allowanceAddress) {
		return new Promise((resolve, reject) => {
			this.usdtContract.methods.allowance(window.ethereum.selectedAddress, allowanceAddress)
				.call((error, result) => {
					if (!error) {
						resolve(result)
					} else {
						reject('Failed to query authorization record')
					}
				})
		})
	}

	/**
	 * 跨链
	 * @param crossOptions 1.代币地址。2.数量。3.转账地址。4.链的代号(自行约定)
	 */
	crossChain (crossOptions) {
		return new Promise((resolve, reject) => {
			this.routerContract.methods.crossChain(...crossOptions).send(
				{ from: window.ethereum.selectedAddress },
				(err, res) => {
					if (err) {
						reject(err)
					} else {
						resolve(res)
					}
				}
			)
		})
	}

	decodeLog (inputs,logdata,logtopics) {
		console.log(inputs,logdata,logtopics)
		console.log(web3.eth)
		return web3.eth.abi.decodeLog(inputs,logdata,logtopics)
	}

	/**
	 * 增加流动性
	 * @param params 务必按照coinAddress、amount、accountAddress、timestamp的顺序传参
	 * 1. 币种地址
	 * 2. 数量
	 * 3. 账户地址
	 * 4. 时间戳
	 */
	addLiquidity (params) {
		return new Promise((resolve, reject) => {
			this.routerContract.methods.addLiquidity(...params)
				.send(
					{ from: window.ethereum.selectedAddress },
					(err, res) => {
						if (err) {
							reject(err)
						} else {
							resolve(res)
						}
					}
				)
		})
	}

	/**
	 * 增加流动性
	 * 务必按照coinAddress、amount、accountAddress、timestamp的顺序传参
	 * 1. 币种地址
	 * 2. 数量
	 * 3. 账户地址
	 * 4. 时间戳
	 */
	removeLiquidity () {
		return new Promise((resolve, reject) => {
			this.routerContract.methods.removeLiquidity(...arguments)
				.send(
					{ from: window.ethereum.selectedAddress },
					(err, res) => {
						if (err) {
							reject(err)
						} else {
							resolve(res)
						}
					}
				)
		})
	}

	/**
	 * 查询池子的总容量和用户的占比
	 * @param params
	 * 1. 币种地址
	 * 2. 账户地址
	 * @param instance_
	 */
	getUserReserves (params, instance_) {
		return new Promise((resolve, reject) => {
			this[instance_ || 'routerContract'].methods.getUserReserves(...params)
				.call((err, res) => {
					if (err) {
						reject(err)
					} else {
						resolve(res)
					}
				})
		})
	}

}