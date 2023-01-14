/**
 * @File Http
 * @Author nagatoyuki
 * @Date 2021/7/19 - 10:38 上午
 */
import axios from "axios";

// 'https://www.zoswap.com/api/'
let baseUrl = `${window.location.origin}/api/`

if (/localhost/.test(window.location.href)) {
	baseUrl = 'https://new.zooswap.site/api/'
}

const instance_ = axios.create({
	baseURL: baseUrl,
	headers: {},
	timeout: 10000
})

instance_.interceptors.request.use(
	config => {
		return config
	},
	err => {
		return Promise.reject(err)
	}
)

instance_.interceptors.response.use(
	res => {
		if (res.data.code === 1) {
			return res.data
		} else {
			return Promise.reject('网络错误，请稍后重试。')
		}
	},
	err => {
		return Promise.reject(err)
	}
)

export default instance_