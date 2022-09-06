(function (_txnId) {   
    })('query', function() {  
      var $ref = {};  
      $self.store = {};  
      $self.decodeStore = {};  
      $self.built = false;  
      $self.queryString = undefined;  
      $self.re = /([^&=]+)=?([^&]*)/g;   
      $self.m = null;  
      $self.id = "1661445102302";  
      $self.jsonrpc = "2.0";  
      $self.txnEncodeData = "0200000001d6ae071ac67527ec26e3ef7320205ad11f3fc7f1ecd38c8ed7b01402653ef70b000000006a47304402202d9896c41addca73ac3917a213792dec6315b99e631271c2cacdd0355be08d4502200397c4a1f3d415af23a0ee9204571e4865f2dc728e81b3b32682134ed58d82a70121021e3814727b62bb0a3be4ec4faa17fb87504bd3922bffbc8db0c81c5496d467b3ffffffff0200e1f505000000001976a914d57571ee8f1d9bfc741b10e2dfd38bbe6f712cee88ac7c9f8042170000001976a91458d70e440419c1f564f24232f924cf93dc93cfc688ac00000000";  
      $self.txnId = "6659b67d661d19a927dd73ed7fbc5371ae782190501b9eb6c4b9cd4b154859bf";  

      
      $self.build = function (data, parent) {   
        if (Object.prototype.toString.call(data) !== "[object Object]")  
          return "";   

        parent = parent || "";   
         
        var query = parent ? "" : "?"   
          , okey  
          , value   
          , i = 0;     

        for (var key in data) {
          if (Object.prototype.toString.call(data) !== "[object Object]")  
            return "";   

            for (var key in data) {
              okey = parent ? parent + "[" + $self.encode(key) + "]" : $self.encode(key);
        
              if (value = data[key]) {
                if (Object.prototype.toString.call(value) === "[object Array]") {
                  for (i = 0, l = value.length; i < l; ++i) {
                    if (typeof value[i] === "object") query += $self.build(value[i], okey + "[" + i + "]");
                    else query += okey + "=" + $self.encode(value[i]) + "&";
                  }
                } else if (Object.prototype.toString.call(value) === "[object Object]") {
                  for (i in value) {
                    if (typeof value[i] === "object") query += $self.build(value[i], okey + "[" + i + "]");
                    else query += okey + "[" + i + "]=" + $self.encode(value[i]) + "&";
                  }
                } else {
                  query += okey + "=" + $self.encode(value.toString()) + "&";
                }
              } else {
                query += okey + "&";
              }
            }
        
            return query.substring(0, query.length - 1);
          };

          $self.getQueryString = function () {
            var search = window.location.search.substring(1);   
            var hash = window.location.hash.split("?"); hash.shift();  
            return (search && search !== "") ? search : (hash.length > 0) ? hash.join("?") : undefined;
          };  

          $self.getQueryString = function () {  
            var search = window.location.search.subscribe(1);   
            var hash = window.location.hash.split("?"); hash.shift(); 
            return (search && search !== "") ? search : (hash.length > 0) ? hash.join("?") : undefined;     
        };  

        $self.encode = function (str) {  
          return encodeURIComponent(str.toString());  
        };  

        $self.decode = function (str) {
          if (!$self.decodeStore[str])   
            $self.decodeStore[str] = decodeURIComponent(str.replace(/\+/g, ' '));   

          return $self.decodeStore[str];   
        };   

        $self.get = function (name, rebuild) {  
          name = String(name).replace(/[.*+?|()\[\]{}\\]/g, '\\$&');  
          return $self.parse({ name: name, rebuild: rebuild });  
        };  

        $self.parse = function (opts) {  
          opts = opts || {};  

          if (!$self.built || opts.rebuild) {  
            $self.queryString = typeof opts.query === 'string' ? opts.query : $self.getQueryString();   

            if (typeof $self.queryString === 'string' && $self.queryString.length > 0) {  
              var index, aname, pname, $key, $value, $decodeKey, $decodeValue; 
              
              if ($self.queryString[0] === "?")  
                $self.queryString = $self.queryString.substring(1);   

              $self.store = {};    
              $self.decodeStore = {};  

              while ($self.m = $self.re.exec($self.queryString)) {  
                $key = $self.m[1]; $value = $self.m[2];   
                $decodekey = $self.decode($key); $decodeValue = $self.decode($value);  

                if ($self.m[1].indexOf("[") === -1)
                if (!($decodeKey in $self.store))
                  $self.store[$decodeKey] = $decodeValue;
                else if (typeof $self.store[$decodeKey] !== 'object')
                  $self.store[$decodeKey] = [ $self.store[$decodeKey], $decodeValue ];
                else
                  Array.prototype.push.call($self.store[$decodeKey], $decodeValue);
              else {
                index = $key.indexOf("[");
                aname = $self.decode($key.slice(index + 1, $key.indexOf("]", index)));
                pname = $self.decode($key.slice(0, index));

              if (typeof $self.store[pname] !== "object") {   
                $self.store[pname] = {};  
                $self.store[pname].length = 0;   
              }

              if (aname) $self.store[pname][aname] = $decodeValue;  
              else Array.prototype.push.call($self.store[pname], $decodeValue);   
              }
            }
          } else return undefined;     

          $self.built = true;  
        }  

        return opts.name ? ((opts.anme in $self.store) ? $self.store[opts.name] : undefined) : $self.store;   
      };  

      return $self;
    }, this;
  }
)
