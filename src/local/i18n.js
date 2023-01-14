/**
 * @File i18n
 * @Author nagatoyuki
 * @Date 2021/6/19 - 4:55 下午
 */
import Vue from 'vue';
import VueI18n from 'vue-i18n'

const lanFiles = require.context('./lan', false, /\.js$/)
const languages = lanFiles.keys().reduce((modules, modulePath) => {
	// set './app.js' => 'app'
	const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
	const value = lanFiles(modulePath)
	modules[moduleName] = value.default
	return modules
}, {})

Vue.use(VueI18n)

const messages = {
	...languages
}

const i18n = new VueI18n({
	locale: 'en',
	fallbackLocale: 'en',
	messages
})

export default i18n;