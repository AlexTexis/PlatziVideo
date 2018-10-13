module.exports = {
	plugins:[
		require('postcss-import'),
		require('postcss-cssnext')({
			features:{
				autoprefixer:{
					grid:true,
					flexbox:false
				},
				customProperties:false
			}
		})
	]
}