if(process.env.NODE_ENV == 'production'){
    module.exports = {mongoURI :'mongodb://ashish:ashish@ds113749.mlab.com:13749/vidjot-prod'}
} else {
    module.exports = {mongoURI :'mongodb://localhost/vidjot-dev'}
}