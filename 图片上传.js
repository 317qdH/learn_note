 var list = [1,2,3,4,5,6]
    var flag = true
    var photoUpload = {}
    var tab = true
    photoUpload.batchPhoto = function(resolve,i){
        new cutPromise(function(reso){
            //访问图片是否已满
            setTimeout(function(){
                if(i>10){
                    reso(false)  
                }else{
                    reso(true)  
                }
            }, 100);
        }).then(function(res){
            console.log(res)
            if(!res){
                resolve('失败了')
            }else{
                setTimeout(function(){
                    resolve('一次完成')
                }, 1000);
            }
        })
    }

    function getPhot(i){
            return new cutPromise(function(resolve,reject){
                photoUpload.batchPhoto(resolve,i);
            })
        
    }
   
    function m(i){
        //如果相册 已满
        if(i == list.length){
            
            return;
        }
        getPhot(i).then(function(res){
            console.log(res)
            if(res == '失败了'){
                return
            }else{
                i += 1;
                m(i);
            }
        })  
    }
    
    m(0)
    