var utils=require("kango/utils"),object=utils.object;function IO(){}IO.prototype=object.extend(IOBase,{getExtensionFileUrl:function(a){return chrome.extension.getURL(a)},getResourceUrl:function(a){return this.getExtensionFileUrl(a)}});module.exports=new IO;module.exports.getPublicApi=getPublicApi;
