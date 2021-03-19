
/*************************************************************************************/
/* Client side API for manipulating node tree both for browser DOM and developer DOM.
/* Also includes utility functions to support UI hookup for updating events,props and 
/* directives for RADKit using the out-of-the-box functionality.
/*************************************************************************************/

class Lowcodr {

    constructor(app){
      	this.clientApp = app;
      
        this.DOMrefs = {};
        this.eventHandlerQueue = {};
        this.addObjectParameterEvent = {};
        this.renameObjectParameterEvent = {};
        this.copyObjectParameterEvent = {};
      
        this.messageController=this.messageController.bind(this);
        this.broadcastEvent=this.broadcastEvent.bind(this);
        this.addUIComponent=this.addUIComponent.bind(this);
        this.assembleNodeYield=this.assembleNodeYield.bind(this);
        this.setNodeDescriptions=this.setNodeDescriptions.bind(this);
        this.getNodeYield=this.getNodeYield.bind(this);
        this.onDragBegin=this.onDragBegin.bind(this);
        this.onDragDrop=this.onDragDrop.bind(this);
        this.onDragExit=this.onDragExit.bind(this);
        this.onDragEnd=this.onDragEnd.bind(this);
        this.onDragOver=this.onDragOver.bind(this);
        this.onDragEnter=this.onDragEnter.bind(this);
        this.whereIsMouse=this.whereIsMouse.bind(this);
        this.getObjectByType=this.getObjectByType.bind(this);
        this.findRenderedNode=this.findRenderedNode.bind(this);    
      
        this.onMouseEnterComponent=this.onMouseEnterComponent.bind(this);
        this.showComponentConfigurationWindow=this.showComponentConfigurationWindow.bind(this);
        this.renameComponent=this.renameComponent.bind(this);
        this.deleteComponent=this.deleteComponent.bind(this);
        this.renameUIComponent=this.renameUIComponent.bind(this);
        this.openComponentNode=this.openComponentNode.bind(this);
        this.onPropertyUpdate=this.onPropertyUpdate.bind(this);
        this.onEventHandlerUpdate=this.onEventHandlerUpdate.bind(this);
        this.onDirectiveUpdate=this.onDirectiveUpdate.bind(this);
        this.onUpdateMarkup=this.onUpdateMarkup.bind(this);
        this.getObjectListByType=this.getObjectListByType.bind(this);
        this.getObjectMapByType=this.getObjectMapByType.bind(this);
        this.copyComponent=this.copyComponent.bind(this);
        this.copyUIComponent=this.copyUIComponent.bind(this);
        this.setComponentLabel=this.setComponentLabel.bind(this);
        this.joinSchemaPath=this.joinSchemaPath.bind(this);
        this.onMouseOutComponent=this.onMouseOutComponent.bind(this);
        this.applyTiling=this.applyTiling.bind(this);
        this.initUIBuilder=this.initUIBuilder.bind(this);
        this.findComponentByTag=this.findComponentByTag.bind(this);
        this.mergeObjects=this.mergeObjects.bind(this);
        this.showComponentConfigDialog=this.showComponentConfigDialog.bind(this);
        this.buildComponentPropertiesDialog=this.buildComponentPropertiesDialog.bind(this);
        this.onShowSchema=this.onShowSchema.bind(this);
        this.buildComponentDirectivesDialog=this.buildComponentDirectivesDialog.bind(this);
        this.onAddSchemaProp=this.onAddSchemaProp.bind(this);
        this.buildComponentEventsDialog=this.buildComponentEventsDialog.bind(this);
        this.buildComponentMarkupDialog=this.buildComponentMarkupDialog.bind(this);
        this.buildComponentDataModelDialog=this.buildComponentDataModelDialog.bind(this);
        this.dropComponent=this.dropComponent.bind(this);
        this.getContainerDraggable=this.getContainerDraggable.bind(this);
        this.sendRadkitMessage=this.sendRadkitMessage.bind(this);
        this.onMouseEnterShape=this.onMouseEnterShape.bind(this);
        this.onMouseLeaveShape=this.onMouseLeaveShape.bind(this);
        this.onShowBookmarks=this.onShowBookmarks.bind(this);
        this.onOpenBookmark=this.onOpenBookmark.bind(this);
        this.isValidMessage=this.isValidMessage.bind(this);
        this.addComponentProperty=this.addComponentProperty.bind(this);
        this.stripObjectIndex=this.stripObjectIndex.bind(this);
        this.stripLeadingTag=this.stripLeadingTag.bind(this);
        this.getPaletteItem=this.getPaletteItem.bind(this);
        this.getNodeURLPath=this.getNodeURLPath.bind(this);
        
        this.fetchComponentSchema=this.fetchComponentSchema.bind(this);
        this.postMessage=this.postMessage.bind(this);
        this.insertSlotComponent=this.insertSlotComponent.bind(this);
        this.switchActiveComponentContext=this.switchActiveComponentContext.bind(this);
        this.findAppRootComponent=this.findAppRootComponent.bind(this);
        this.hashToPath=this.hashToPath.bind(this);
        this.enableMouseEnterAwarenessToggle=this.enableMouseEnterAwarenessToggle.bind(this);
      	this.getBrowserParam=this.getBrowserParam.bind(this);
		this.initUIBuilder();
    }
  
  	getClientAppData(key){
      	return key?this.clientApp[key]:this.clientApp;
    }  
  	setClientAppData(key,val){
      	this.clientApp[key] = val;
    }  

  
  	////////////////////////////////////////////////////////////////////////////////////
  	//Core messaging API:
  	//IDE messaging and response routing.
	////////////////////////////////////////////////////////////////////////////////////
    isValidMessage(event){
        var vm = this;

        if(event.data.pageMessageChannelID && 
           event.data.pageMessageChannelID == vm.pageMessageChannelID)
              return true;

        if(event.data.responseTo && 
           event.data.responseTo.pageMessageChannelID && 
           event.data.responseTo.pageMessageChannelID == vm.pageMessageChannelID)
              return true;  

        var urlPath = decodeURIComponent(window.location.pathname);
        if(urlPath.endsWith("/index.ins") || urlPath.endsWith("/"))
            urlPath = urlPath.substring(0,urlPath.lastIndexOf("/")); 

        console.log("urlPath:"+urlPath);

        if(event.data.objectPath)
        {
            var renderedNode = vm.findRenderedNode(event.data.objectPath);
            if(renderedNode)
              return true;

            if(urlPath.endsWith(event.data.objectPath))
              return true;      
        }

        if(event.data.node && event.data.node.objectPath)
        {
            var renderedNode = vm.findRenderedNode(event.data.node.objectPath);
            if(renderedNode)
              return true;   

            if(urlPath.endsWith(event.data.node.objectPath))
              return true;           
        }  

        if(event.data.param && event.data.param.objectPath)
        {
           var renderedNode = vm.findRenderedNode(event.data.param.objectPath);
           if(renderedNode)
              return true;  

           if(urlPath.endsWith(event.data.param.objectPath))
              return true;           
        }   
       return false;
    }  
  	messageController(event){
        var vm = this;
        console.log(event);
        if(!vm.isValidMessage(event))
        {
           console.log("unidentified message");
           return;
        }

        if(event.data.responseTo && event.data.responseTo.handlerQueueId)
        {
            var handler = vm.eventHandlerQueue[event.data.responseTo.handlerQueueId];
            if(handler)
            {
                delete vm.eventHandlerQueue[event.data.responseTo.handlerQueueId];        
                handler.resolve(event);
            }

            if(event.data.responseTo.eventQueue && 
               event.data.responseTo.eventQueue.length>0 &&
               event.data.responseTo.autoProcessEventQueue)
            {
                var eventQueue  = [];
                for(var eventIndex= 0;eventIndex<event.data.responseTo.eventQueue.length;eventIndex++)
                {
                   if(event.data.responseTo.eventQueue[eventIndex].independent)//just spin off independent events
                     vm.broadcastEvent(event.data.responseTo.eventQueue[eventIndex]);
                   else
                     eventQueue.push(event.data.responseTo.eventQueue[eventIndex]);              
                }

                if(eventQueue.length>0)
                {
                    var dequeuedEvent = eventQueue[0];
                    var eventQueue    = eventQueue.slice(1);

                    //attached succeeding events dependent on this dequeued event
                    if(eventQueue.length>0)
                    {
                        //if dequeued event has its own queued events then assume those 
                        //should be processed before any events that dependently
                        //succeed the dequeued event itself. ie a depth-first proceessing of queued events
                        if(dequeuedEvent.eventQueue)
                          eventQueue = dequeuedEvent.eventQueue.concat(eventQueue);

                        dequeuedEvent  = Object.assign(dequeuedEvent,{"eventQueue":eventQueue});
                    }
                    vm.broadcastEvent(dequeuedEvent);
                }
            }      
            return;
        }


        if(event.data.message == "callSchema-response"){

            if(event.data.response/*.status == "success"*/)
            {
                var component = vm.getClientAppData().composerDOM[event.data.responseTo.objectPath];

                if(event.data.responseTo.schemaPath.endsWith("#/properties/Settings"))
                {
                    //prepare property list
                      //a. Initialize properties via values from node
                      //b. Set properties to update UI
                    var settings = event.data.response;
                    var settingsValues = vm.getObjectListByType(component,"ComponentSettings{}");
                    var properties = [];
                    for(var settingsName in settings.properties)
                    { 
                         var prop = {"name":settingsName,"objectPath":null,"isSet":false,"value":null,"type":settings.properties[settingsName].type};

                         if(settingsValues)
                         {
                             for(var s=0;s<settingsValues.length;s++)
                             {
                                 if(settingsValues[s]["xsolvent_build_artifact"])
                                    continue;

                                 if(settingsValues[s][settingsName])
                                 {
                                    prop.value = settingsValues[s][settingsName];                                
                                    prop.isSet = true;
                                    prop.objectPath = settingsValues[s]["xsolvent_node_path"];
                                    break;
                                 }                             
                             }
                             if(!prop.isSet && settingsValues.length>0)
                             {//add to first settings object
                                for(var s=0;s<settingsValues.length;s++)
                                {
                                    if(settingsValues[s]["xsolvent_build_artifact"])
                                        continue;

                                    prop.objectPath = settingsValues[s]["xsolvent_node_path"];
                                    break;
                                }
                             }
                         }
                         properties.push(prop);
                    }
                  	//vm.getClientAppData().configurationProperties = properties;
                    vm.setClientAppData("configurationProperties",properties);
                    console.log("configurationProperties");
                    console.log(vm.getClientAppData("configurationProperties"));
                }
                else
                if(event.data.responseTo.schemaPath.endsWith("#/properties/Events"))
                {          
                    //prepare event handler list
                      //a. Initialize properties via values from node
                      //b. Set handlers to update UI
                    var events = event.data.response;
                    var implementedEventsValues = null;
                    var eventEnumerator = vm.getObjectByType(component,"AvailableComponentEvents{}");
                    if(eventEnumerator != null)
                        implementedEventsValues = vm.getObjectListByType(eventEnumerator,"ComponentEvent{}");

                    var eventHandlers = [];
                    for(var eventsName in events.properties)
                    { 
                         var event = {"name":eventsName,"objectPath":null,"isSet":false,"code":null};

                         if(implementedEventsValues != null)
                         {
                             for(var ie=0;ie<implementedEventsValues.length;ie++)
                             {
                                 if(implementedEventsValues[ie]["xsolvent_object_schema"].endsWith(eventsName))
                                 {
                                     var eventAction = vm.getObjectByType(implementedEventsValues[ie],"ComponentEventAction{}");
                                     if(eventAction != null)
                                     {
                                        event.code = eventAction.code;                                    
                                        event.isSetAction = true;
                                        event.actionObjectPath = implementedEventsValues[ie]["xsolvent_node_path"]+eventAction["xsolvent_node_path"];
                                     }
                                     event.isSet = true;
                                     event.objectPath = implementedEventsValues[ie]["xsolvent_node_path"];
                                 }
                             }
                             event.isSetEnumerator = true;
                             event.enumeratorObjectPath = eventEnumerator["xsolvent_node_path"];
                         }
                         eventHandlers.push(event);
                    }
                    vm.setClientAppData("configurationEvents",eventHandlers);         
                    console.log("configurationEvents");
                    console.log(vm.getClientAppData("configurationEvents"));
                }
                else
                if(event.data.responseTo.schemaPath.endsWith("#/properties/Directives"))
                {          
                    //prepare directive list
                      //a. Initialize directives via values from node
                      //b. Set directives to update UI   
                    var directives = event.data.response;
                    var directivesValues = vm.getObjectByType(component,"Directives{}");
                    var directivesExpressions = [];
                    for(var directivesName in directives.properties)
                    { 
                         var directive = {"name":directivesName,"objectPath":null,"isSet":false,"expression":null};

                         if(directivesValues)
                         {
                             for(var d=0;d<directivesValues.length;d++)
                             {
                                 if(directivesValues[d][directivesName])
                                 {
                                    directive.expression = directivesValues[d][directivesName];                                
                                    directive.isSet = true;
                                    directive.objectPath = directivesValues[d]["xsolvent_node_path"];
                                 }
                             }
                             if(!directive.isSet && directivesValues.length>0)
                             {//add to first settings object
                                directive.objectPath = directivesValues[0]["xsolvent_node_path"];
                             }                       
                         }
                         directivesExpressions.push(directive);
                    }
                    vm.setClientAppData("configurationDirectives",directivesExpressions);
                    console.log("configurationDirectives");
                    console.log(vm.getClientAppData("configurationDirectives"));
                }
                else
                if(event.data.responseTo.schemaPath.endsWith("#/properties/Markup"))
                {
                    //prepare markup list
                      //a. Initialize markups via values from node
                      //b. Set markups to update UI   
                    var markups = event.data.response;

                    var markupsValues = vm.getObjectListByType(component,"MarkupOverride{}");
                    var markupsCode = [];
                    for(var m=0;m<markupsValues.length;m++)
                    {
                       var markupsName = markupsValues[m]["xsolvent_node_path"];
                       var markup = {"name":markupsName,"objectPath":markupsValues[m]["xsolvent_node_path"],"isSet":false,"text":markupsValues[m].text};
                       if(typeof markupsValues[m].text != "undefined")
                            markup.isSet = true;

                       markupsCode.push(markup);
                    }

                    /*
                    var markupsValues = vm.getObjectMapByType(component,"MarkupOverride{}");
                    var markupsCode = [];
                    for(var markupsName in markupsValues)
                    {
                        var markup = {"name":markupsName,"objectPath":null,"isSet":false,"text":markupsValues[markupsName].text};
                        markup.objectPath = markupsValues[markupsName]["xsolvent_node_path"];
                        markup.isSet = true;
                        markupsCode.push(markup);
                    }
                    */

                    vm.setClientAppData("configurationMarkups",markupsCode);
                    console.log("configurationMarkups");
                    console.log(vm.getClientAppData("configurationMarkups"));
                    console.log(component);        
                }
                else
                if(event.data.responseTo.schemaPath.endsWith("#/properties/Date Model"))
                {
                    //prepare model list
                      //a. Initialize models via values from node
                      //b. Set models to update UI   
                    var models = event.data.response;
                    var modelsValues = vm.getObjectListByType(component,"InstanceDataModel{}");
                    var modelsData = [];
                    for(var md=0;md<modelsValues.length;md++)
                    {
                        var vueModel = modelsValues[md];
                        var modelsName = vueModel["xsolvent_node_path"];                    
                        var model = {"name":modelsName,"objectPath":component["xsolvent_node_path"],"variables":[]};

                        for(var v in vueModel)
                        {
                            if(!v.startsWith("xsolvent_") && !v.startsWith("solvent_"))
                            {
                                var variable = {"name":v,"objectPath":vueModel["xsolvent_node_path"],"type":"scalar"};
                                if(vueModel[v] && typeof vueModel[v] == "object")
                                {
                                   variable.type = "crud";
                                   variable.dataObjectPath = vueModel[v]["xsolvent_node_path"];
                                }
                                model.variables.push(variable);
                            }
                        }
                        modelsData.push(model);
                    }
                    vm.setClientAppData("configurationModels",modelsData);
                    console.log("configurationModels");
                    console.log(vm.getClientAppData("configurationModels"));
                    console.log(component);        
                }

                vm.setClientAppData("showConfigurationDialog",true);
            }
        }
        else  
        if(event.data.message == "moveParameter-response"){

          if(event.data.response.status == "success")
          {
              var srcSinkObjectPath  = event.data.responseTo.srcObjectPath;        
              var srcSinkObjectURLPath = event.data.response.srcObjectURLPath;
              vm.radkitServer(srcSinkObjectURLPath,srcSinkObjectPath);   

              //only refresh destination sink if different from source
              if(event.data.responseTo.srcObjectPath != event.data.responseTo.destObjectPath)
              {
                 var destSinkObjectPath  = event.data.responseTo.destObjectPath;  
                 var destSinkObjectURLPath = event.data.response.destObjectURLPath;
                 vm.radkitServer(destSinkObjectURLPath,destSinkObjectPath); 
              }

              /*
              //object path not including app context
              var destSinkObjectPath 		 = event.data.responseTo.hitMode != "child"?event.data.responseTo.destObjectPath.substring(0,event.data.responseTo.destObjectPath.lastIndexOf("/")):event.data.responseTo.destObjectPath;        

              var srcSinkObjectURLPath = event.data.response.srcObjectURLPath.substring(0,event.data.response.srcObjectURLPath.lastIndexOf("/"));
              vm.radkitServer(srcSinkObjectURLPath,destSinkObjectPath);   

              var destSinkObjectURLPath = event.data.responseTo.hitMode != "child"?event.data.response.destObjectURLPath.substring(0,event.data.response.destObjectURLPath.lastIndexOf("/")):event.data.response.destObjectURLPath;
              if(srcSinkObjectURLPath != destSinkObjectURLPath)//only refresh destination sink is different from source
                vm.radkitServer(destSinkObjectURLPath,destSinkObjectPath); 

              //window.location.reload();
              */
          }
        }  
        else  
        if(event.data.message == "copyParameter-response"){

          if(event.data.response.status == "success")
          {
              var destSinkObjectPath  = event.data.responseTo.destObjectPath;  
              var destSinkObjectURLPath = event.data.response.destObjectURLPath;
              vm.radkitServer(destSinkObjectURLPath,destSinkObjectPath); 


              /**
              //object path not including app context
              var destSinkObjectPath 		 = event.data.responseTo.hitMode != "child"?event.data.responseTo.destObjectPath.substring(0,event.data.responseTo.destObjectPath.lastIndexOf("/")):event.data.responseTo.destObjectPath;        

              var srcSinkObjectURLPath = event.data.response.srcObjectURLPath.substring(0,event.data.response.srcObjectURLPath.lastIndexOf("/"));
              vm.radkitServer(srcSinkObjectURLPath,destSinkObjectPath);   

              var destSinkObjectURLPath = event.data.responseTo.hitMode != "child"?event.data.response.destObjectURLPath.substring(0,event.data.response.destObjectURLPath.lastIndexOf("/")):event.data.response.destObjectURLPath;
              if(srcSinkObjectURLPath != destSinkObjectURLPath)//only refresh destination sink is different from source
                vm.radkitServer(destSinkObjectURLPath,destSinkObjectPath); 

              //window.location.reload();
              **/
          }
        }    
        else
        if(event.data.message == "addParameter-response"){

          if(event.data.response.status == "success")
          {
              //object path not including app context
              //var destSinkObjectPath 		 = event.data.responseTo.hitMode != "child"?event.data.responseTo.destObjectPath.substring(0,event.data.responseTo.destObjectPath.lastIndexOf("/")):event.data.responseTo.destObjectPath;                
              var destSinkObjectPath 		 = event.data.responseTo.objectPath;

              //var destSinkObjectFramePath = event.data.response.objectURLPath.substring(0,event.data.response.objectURLPath.lastIndexOf("/"));
              var destSinkObjectFramePath = event.data.response.objectURLPath;
              vm.radkitServer(destSinkObjectFramePath,destSinkObjectPath);
              //window.location.reload();
              if(event.data.responseTo.eventQueue && event.data.responseTo.eventQueue.length>0)
              {
                 var dequeuedEvent = event.data.responseTo.eventQueue[0];
                 dequeuedEvent  = Object.assign(dequeuedEvent,{"eventQueue":event.data.responseTo.eventQueue.slice(1)});
                 vm.broadcastEvent(dequeuedEvent);
              }
          }
        }
        else
        if(event.data.message == "deleteParameter-response"){

          if(event.data.response.status == "success")
          {
              //object path not including app context
              var destSinkObjectPath 		 = event.data.responseTo.objectPath;              

              var destSinkObjectFramePath = event.data.response.objectURLPath;
              vm.radkitServer(destSinkObjectFramePath,destSinkObjectPath);
              //window.location.reload();
          }
        }  
        else
        if(event.data.message == "renameParameter-response"){

          if(event.data.response.status == "success")
          {
              //object path not including app context
              var destSinkObjectPath 		 = event.data.responseTo.objectPath;              

              var destSinkObjectFramePath = event.data.response.objectURLPath;
              vm.radkitServer(destSinkObjectFramePath,destSinkObjectPath);
              //window.location.reload();
          }
        } 
        else
        if(event.data.message == "updateParameter-response"){

          if(event.data.response.status == "success")
          {
              //object path not including app context
              var destSinkObjectPath 		 = event.data.responseTo.objectPath;              

              var destSinkObjectFramePath = event.data.response.objectURLPath;
              vm.radkitServer(destSinkObjectFramePath,destSinkObjectPath);
              //window.location.reload();
          }
        }    
        else
        if(event.data.message == "radkit-composer-nodeUpdate"){

            //find first UI component that this object descends from
            var renderedNode = vm.findRenderedNode(vm.stripObjectIndex(event.data.node.objectPath));

            var srcSinkObjectPath = vm.stripObjectIndex(renderedNode.path);
            if(event.data.mutationEvent && event.data.mutationEvent.event == "delete")      
                srcSinkObjectPath = srcSinkObjectPath.substring(0,srcSinkObjectPath.lastIndexOf("/"));

            vm.radkitServer(vm.getNodeURLPath(srcSinkObjectPath),srcSinkObjectPath);
        }
        else
        if(event.data.message == "getAppObject-response"){
            vm.appDefinition = event.data.response.app;
        }
        else
        if(event.data.message == "IDEaction"){

            if(event.data.IDEaction == "applyTiling")
            {
                var directive = event.data.param.directive;
                var objectPath = event.data.param.objectPath;

                if(directive != "parent" && directive != "root")//sync with ui
                        vm.getClientAppData("tilingState")[directive] = true;
                else
                if(directive == "root")
                {
                    var component = vm.findComponentByTag("v-main")[0];
                    vm.mergeObjects(vm.getClientAppData("tilingState"),{"self":true});
                    directive = "self";
                    objectPath = component;              
                }

                vm.applyTiling(directive,objectPath).
                then(function(reply){
                    var IDEEvent = Object.assign({},{
                      "message":event.data.IDEaction+"-response",                                      	
                      "responseTo":event.data,
                      "response":reply
                    });              
                    vm.broadcastEvent(IDEEvent);            
                });
                return;
            }
            else
            if(event.data.IDEaction == "refreshNode")
            {
                vm.radkitServer(vm.getNodeURLPath(event.data.param.objectPath),
                               event.data.param.objectPath).
                then(function(reply){
                    var IDEEvent = Object.assign({},{
                      "message":event.data.IDEaction+"-response",                                      	
                      "responseTo":event.data,
                      "response":reply
                    });              
                    vm.broadcastEvent(IDEEvent);            
                });
                return;
            }      
            else
            if(event.data.IDEaction == "toggleComponentPalette")
            {
                vm.showComponentPalette = !vm.showComponentPalette;
                var IDEEvent = Object.assign({},{
                  "message":event.data.IDEaction+"-response",                                      	
                  "responseTo":event.data
                });              
                vm.broadcastEvent(IDEEvent);
                return;
            }           
            else
            if(event.data.IDEaction == "toggleComponentObjectToolbar")
            {
                vm.setClientAppData("enableMouseEnterAwareness", !vm.getClientAppData("enableMouseEnterAwareness"));
                var IDEEvent = Object.assign({},{
                  "message":event.data.IDEaction+"-response",                                      	
                  "responseTo":event.data
                });              
                vm.broadcastEvent(IDEEvent);
                return;
            }

            vm.sendRadkitMessage(event.data.url,{
              "solvent_radkit_composer_action":event.data.IDEaction,
              "solvent_radkit_composer_action_type":event.data.IDEactionType
            })
              .then(function(reply){
                if(event.data.responseMessage)
                {
                    var IDEEvent = Object.assign({},{
                      "message":event.data.responseMessage,                                      	
                      "responseTo":event.data,
                      "response":reply
                    });              
                    vm.broadcastEvent(IDEEvent); 
                }
                else
                {
                    var IDEEvent = Object.assign({},{
                      "message":event.data.IDEaction+"-response",                                      	
                      "responseTo":event.data,
                      "response":reply
                    });              
                    vm.broadcastEvent(IDEEvent); 
                }
            });
        }  
    }
    broadcastEvent(event){
      console.log("broadcastEvent from:"+window.location.href+", srcNavTabId:"+this.srcNavTabId+", pageMessageChannelID:"+this.pageMessageChannelID);

      var url_string = window.location.href;
      var url = new URL(url_string);

      this.bc.postMessage(Object.assign(event,{
        "origin":window.location.href,
        "targetNavTabId":this.srcNavTabId,
        "pageMessageChannelID":this.pageMessageChannelID,
        "repoId":url.searchParams.get("repoId")
      })); 
    }
    postMessage(message,callback){
        var vm = this;
        var dfd = new $.Deferred();

        var handlerQueueId = new Date().getTime();
        var resolver = callback || {"resolve":function(event){
            dfd.resolve(event);
        }};
        vm.eventHandlerQueue[handlerQueueId] = resolver;
        vm.broadcastEvent(Object.assign(message,{"handlerQueueId":handlerQueueId}));
        return dfd.promise();
    }
  
  
  	////////////////////////////////////////////////////////////////////////////////////
  	//DnD UI Hook API:
  	//Facilitates DnD support including messaging between IDE and RADKit.
	////////////////////////////////////////////////////////////////////////////////////  
    onDragBegin(event,nodePath){
        var vm = this;
		event.dataTransfer.setData("srcObjectNode", nodePath);
        console.log("onDragBegin:"+nodePath);
        event.stopPropagation();  
        $("#solvent_lastmile_drop_position_indicator").css("display","none"); 

        vm.setClientAppData("clipboardState",{"mode":"move","component":nodePath});


         $("#solvent_lastmile_drop_position_indicator")
           .css({"display":"block"/*,"min-width":indicatorWidth*/})
           .position({
            my:"center top",
            at:"center top",
            of:window  
          })  
    }
    onDragDrop(event,destNodePath){

        event.preventDefault();
        event.stopPropagation();

        $(event.target).removeClass("lastmile-visual-push-right");
        $(event.target).removeClass("lastmile-visual-push-left");  

        var vm = this;
        var fromPalette = (event.dataTransfer.getData("fromPalette") == "true");
        if(fromPalette)
            vm.setClientAppData("clipboardState",{"mode":"new","component":null});

      
        var hitMode = $("#solvent_lastmile_drop_position_indicator").data("hitMode");
        $("#solvent_lastmile_drop_position_indicator").css("display","none"); 

        var srcNodePath = event.dataTransfer.getData("srcObjectNode");  
        //console.log("srcObjectNode:"+srcNodePath);
      	//console.log("destNodePath:"+destNodePath);

        if(srcNodePath == destNodePath)
        {
            return;
        }
      
        if(event.dataTransfer.getData("clipboardState"))
        {
          vm.setClientAppData("clipboardState",{"mode":event.dataTransfer.getData("clipboardState"),"component":srcNodePath});
        }          
      
      
        if(vm.getClientAppData("clipboardState").mode == 'new')//reset any previous palette drag initiation
        {      
          //vm.clipboardState.mode = "copy";
          //vm.clipboardState.component = null;
          vm.setClientAppData("clipboardState",{"mode":"copy","component":null});
        }

        vm.dropComponent(event,srcNodePath,destNodePath,hitMode,fromPalette);  
    }
    onDragExit(event,nodePath){
      $(event.target).removeClass("lastmile-visual-push-right");
      $(event.target).removeClass("lastmile-visual-push-left");
      //$("#solvent_lastmile_drop_position_indicator").css("display","none"); 
    }
    onDragEnd(event){
      $("#solvent_lastmile_drop_position_indicator").css("display","none"); 
      //console.log("onDragEnd");
    }
    onDragOver(event,destNodePath){
        var vm = this;
        event.preventDefault();
        event.stopPropagation();

        $("#solvent_lastmile_drop_position_indicator")
          .children()
          .removeClass("solvent_lastmile_drop_position_indicator_active");  

        $(event.target)
          .removeClass("lastmile-visual-push-right")
          .removeClass("lastmile-visual-push-left");

        //dynamically determine drop position based on where mouse is within target bounding box
        if(vm.whereIsMouse(event) == "left")
        {
            $("#solvent_lastmile_drop_position_indicator")
              .children().eq(0)
              .addClass("solvent_lastmile_drop_position_indicator_active"); 

            $("#solvent_lastmile_drop_position_indicator").data("hitMode","before");
            $(event.target).addClass("lastmile-visual-push-right");
        }
        else
        if(vm.whereIsMouse(event) == "middle")
        {
            $("#solvent_lastmile_drop_position_indicator")
              .children()
              .eq(1)
              .addClass("solvent_lastmile_drop_position_indicator_active"); 

            $("#solvent_lastmile_drop_position_indicator").data("hitMode","child");
        }
        else
        if(vm.whereIsMouse(event) == "right")
        {
            $("#solvent_lastmile_drop_position_indicator")
              .children()
              .eq(2)
              .addClass("solvent_lastmile_drop_position_indicator_active"); 

            $(event.target).addClass("lastmile-visual-push-left");
            $("#solvent_lastmile_drop_position_indicator").data("hitMode","after");
        }
    }
    onDragEnter(event,destNodePath){
        var vm = this;
        event.preventDefault();
        event.stopPropagation();

       /*var indicatorWidth = 256;
       $("#solvent_lastmile_drop_position_indicator")
         .css({"display":"block","min-width":indicatorWidth})
         .position({
          my:"left+15 top-10",
          of:event  
        })*/

        if($("#solvent_lastmile_drop_position_indicator").is(":hidden"))
        {
           $("#solvent_lastmile_drop_position_indicator")
             .css({"display":"block"/*,"min-width":indicatorWidth*/})
             .position({
              my:"center top",
              at:"center top",
              of:window  
            })       
        }

       var component = vm.getClientAppData().composerDOM[destNodePath];
       vm.setClientAppData("activeDropTargetComponentTag","");
       if(component)
          vm.setClientAppData("activeDropTargetComponentTag",component.xsolvent_radkit_composer_markupTag);  
    }
    

  	////////////////////////////////////////////////////////////////////////////////////
  	//Core object graph manipulation API.
  	//Adding, getting,updating and deleting Nodes.
  	////////////////////////////////////////////////////////////////////////////////////  
    addUIComponent(event){
        var vm = this;
        if(vm.getClientAppData("droppedComponentIsWrapper"))
        {
           vm.insertSlotComponent(vm.addObjectParameterEvent);
           vm.setClientAppData("droppedComponentIsWrapper",false);
           return;      
        }

        vm.addObjectParameterEvent = 
          Object.assign(vm.addObjectParameterEvent,
           {"name":vm.getClientAppData("parameterName")+"{}",
            "parameter":{
                "name":vm.getClientAppData("parameterName"),
                "type":"crud",
                "isFinal":"yes",
                "evalRight":"yes",
                "defaultValue":vm.getClientAppData("parameterName")+"{}"
            }
        });

        if(vm.addObjectParameterEvent.dependency)
        {
            var dependency = vm.addObjectParameterEvent.dependency;
            delete vm.addObjectParameterEvent["dependency"];

            dependency.eventQueue.push(vm.addObjectParameterEvent),
            vm.addObjectParameterEvent = dependency;      
        }

        vm.broadcastEvent(vm.addObjectParameterEvent);
        vm.addObjectParameterEvent = null;
        vm.setClientAppData("parameterName","");
    }
    renameComponent(activeComponent){
        var vm = this;

        vm.setClientAppData("parameterName",activeComponent.substring(activeComponent.lastIndexOf("/")+1));
        if(vm.getClientAppData("parameterName").lastIndexOf("{") != -1)
            vm.setClientAppData("parameterName",vm.getClientAppData("parameterName").substring(0,vm.getClientAppData("parameterName").lastIndexOf("{")));
        else
            vm.setClientAppData("parameterName",vm.getClientAppData("parameterName").substring(0,vm.getClientAppData("parameterName").lastIndexOf("[")));


        vm.renameObjectParameterEvent = Object.assign({},{
          "message":"renameParameter",
          "objectPath":activeComponent.substring(0,activeComponent.lastIndexOf("/")),
          "oldName":vm.getClientAppData("parameterName")+"{}"
        });  
        vm.setClientAppData("componentLabelMode","rename");
        vm.setClientAppData("componentLabelAction","Rename");
        vm.setClientAppData("bShowLabelDialog",true);   
    }
    deleteComponent(activeComponent){
        var vm = this;
        var deleteEvent = Object.assign({},{
          "message":"deleteParameter",                                      	
          "objectPath":activeComponent.substring(0,activeComponent.lastIndexOf("/")),
          "name":activeComponent.substring(activeComponent.lastIndexOf("/")+1)
        });
        this.broadcastEvent(deleteEvent);
    }
    renameUIComponent(event){
        this.renameObjectParameterEvent = Object.assign(this.renameObjectParameterEvent,{"name":this.getClientAppData("parameterName")+"{}"});
        this.broadcastEvent(this.renameObjectParameterEvent);
        this.renameObjectParameterEvent = null;
        this.setClientAppData("parameterName","");
        this.setClientAppData("componentLabelMode","new");
    }
    dropComponent(event,srcNodePath,destNodePath,hitMode,fromPalette){
        var vm = this;

        var destContainer = null;  
        var destObjectPath = destNodePath;
        var destContainerNodePath = destNodePath;  

        if(hitMode == "before")
        {
            destContainerNodePath = destNodePath.substring(0,destNodePath.lastIndexOf("{}"));
            destContainerNodePath = destContainerNodePath.substring(0,destContainerNodePath.lastIndexOf("/"));
        }
        else
        if(hitMode == "after")
        {
            destContainerNodePath = destNodePath.substring(0,destNodePath.lastIndexOf("{}"));
            destContainerNodePath = destContainerNodePath.substring(0,destContainerNodePath.lastIndexOf("/"));      
            var targetDestContainer = vm.getClientAppData("DnDcontainers")[destContainerNodePath];  

            //console.log("targetDestContainer.draggables.length:"+targetDestContainer.draggables.length);

            var matched = false;
            var beforeTarget = null;
            for(var td=0;td<targetDestContainer.draggables.length;td++)
            {
                if(targetDestContainer.draggables[td].path == destNodePath)
                {
                    if(td+1<targetDestContainer.draggables.length)
                    {
                       //console.log("targetDestContainer.draggables index:"+(td+1));
                       beforeTarget = targetDestContainer.draggables[td+1].path;
                       hitMode = "before";
                       //console.log(JSON.stringify(targetDestContainer.draggables))
                    }
                    break;
                }
            }

            if(beforeTarget != null)
                destObjectPath = beforeTarget;
            else
            {//dropped after last item so append to container
                destObjectPath = destContainerNodePath;
                hitMode = "child";
            }
        }  
        else
        if(hitMode == "child")
        {

        }    

        var destContainer = vm.getClientAppData("DnDcontainers")[destContainerNodePath];  
        var trueDestObjectPath = destObjectPath;

        var preceedingParam = null;
        if(hitMode == "before")
        {
           preceedingParam = trueDestObjectPath.substring(trueDestObjectPath.lastIndexOf("/")+1);
           trueDestObjectPath = trueDestObjectPath.substring(0,trueDestObjectPath.lastIndexOf("/"));       
        }  


        if(fromPalette)
        {
            //srcNode  = vm.getClientAppData().composerDOM[srcNodePath];
            //vm.parameterName = vm.getClientAppData("dndRules").containers[srcNode.xsolvent_radkit_composer_markupTag]?vm.getClientAppData("dndRules").containers[srcNode.xsolvent_radkit_composer_markupTag].label:"Object";
            //vm.parameterName = vm.parameterName+(new Date().getTime());      


            var paletteItem = vm.getClientAppData("palette")?vm.getPaletteItem(srcNodePath.split("/").slice(1),vm.getClientAppData("palette")):{};
            if(paletteItem.isWrapper)
            {
               vm.setClientAppData("droppedComponentIsWrapper",true);

               //fetch schema first
               vm.postMessage(Object.assign({},{
                    "message":"callSchema",
                    "schemaPath":paletteItem.schemaPath
                 }))
                 .then(function(paletteItemSchemaReply){

                   var paletteItemSchema = paletteItemSchemaReply.data.response;
                   vm.setClientAppData("droppedComponentSchema",paletteItemSchema);
                   vm.postMessage(Object.assign({},{
                      "message":"callSchema",
                      "schemaPath":vm.joinSchemaPath(paletteItem.schemaPath,"#/properties/Contains")
                     }))
                     .then(function(containsSchemaReply){

                        var containsSchema = containsSchemaReply.data.response;
                        vm.setClientAppData("droppedComponentSlots",[]);
                        for(var prop in containsSchema.properties)
                        {
                           if(!prop.startsWith("solvent_") && !prop.startsWith("$"))
                           {
                              vm.getClientAppData("droppedComponentSlots").push({
                                "schema":containsSchema.properties[prop],
                                "name":prop,
                                "schemaPath":vm.joinSchemaPath(paletteItem.schemaPath,"#/properties/Contains/properties/"+prop),
                              });
                           }
                        }

                        //console.log("droppedComponentSlots");
                        //console.log(vm.droppedComponentSlots);

                        vm.setClientAppData("parameterName",paletteItem.label);
                        vm.setClientAppData("parameterName",vm.getClientAppData("parameterName")+(new Date().getTime()));

                        vm.addObjectParameterEvent = Object.assign({},{
                          "message":"addParameter",
                          "schemaPath":paletteItem.schemaPath,
                          "objectPath":destContainerNodePath,
                          "fullDestObjectPath":destObjectPath,
                          "destObjectPath":trueDestObjectPath,
                          "preceedingParam":preceedingParam,
                          "hitMode":hitMode
                        });
                        vm.setClientAppData("componentLabelAction","Add");
                        vm.setClientAppData("bShowLabelDialog",true);
                        //vm.clipboardState.mode = "copy";//reset
                     	vm.setClientAppData("clipboardState",{"mode":"copy"});
                        return;                 
                   });             
               }); 

              return;
            }
            else
            {
                vm.setClientAppData("parameterName",paletteItem.label?paletteItem.label:"Object");
                vm.setClientAppData("parameterName",vm.getClientAppData("parameterName")+(new Date().getTime()));

                vm.addObjectParameterEvent = Object.assign({},{
                  "message":"addParameter",
                  "schemaPath":paletteItem.schemaPath,
                  "objectPath":destContainerNodePath,
                  "fullDestObjectPath":destObjectPath,
                  "destObjectPath":trueDestObjectPath,
                  "preceedingParam":preceedingParam,
                  "hitMode":hitMode
                });
                vm.setClientAppData("componentLabelAction","Add");
                vm.setClientAppData("bShowLabelDialog",true);
                //vm.clipboardState.mode = "copy";//reset
              	vm.setClientAppData("clipboardState",{"mode":"copy"});
                return;      
            }
        }


        var srcContainerNodePath = srcNodePath.substring(0,srcNodePath.lastIndexOf("{}"));
        srcContainerNodePath = srcContainerNodePath.substring(0,srcContainerNodePath.lastIndexOf("/"));

		
        var srcContainer  = vm.getClientAppData("DnDcontainers")[srcContainerNodePath];
        var srcNode 	  = null;

      	console.log("srcNodePath:"+srcNodePath);
		//console.log("srcContainerNodePath:"+srcContainerNodePath);
      	//console.log(srcContainer);

          for(var d=0;d<srcContainer.draggables.length;d++)
          {
             if(srcContainer.draggables[d].path == srcNodePath) 
             {
                srcNode  = srcContainer.draggables[d];
                break;
             }      
          }



        var srcContainer  = vm.getClientAppData("DnDcontainers")[srcContainerNodePath];
        //var srcNode 	  = srcContainer.draggables[srcNodePath];


        console.log("destContainerNodePath:"+destContainerNodePath);
        console.log("destObjectPath:"+destObjectPath);
        console.log("srcNode.path:"+srcNode.path);
        console.log("hitMode:"+hitMode);    


        var trueSrcObjectPath  = srcNode.path?srcNode.path.substring(0,srcNode.path.lastIndexOf("/")):null;
        var nodeName = srcNode.path?srcNode.path.substring(srcNode.path.lastIndexOf("/")+1):null;  

        if(vm.getClientAppData("clipboardState").mode == "copy" && vm.getClientAppData("clipboardState").component != null && vm.getClientAppData("clipboardState").component.length>0)
        {
            vm.copyObjectParameterEvent = Object.assign({},{
              "message":"copyParameter",
              "srcObjectPath":trueSrcObjectPath,
              "name":nodeName,
              "fullDestObjectPath":destObjectPath,
              "destObjectPath":trueDestObjectPath,
              "preceedingParam":preceedingParam,
              "hitMode":hitMode
            });

            if(vm.getClientAppData("clipboardState").copyAs)
            {
                vm.setClientAppData("parameterName",vm.getClientAppData("clipboardState").component.substring(vm.getClientAppData("clipboardState").component.lastIndexOf("/")+1));
                vm.setClientAppData("parameterName",vm.getClientAppData("parameterName").substring(0,vm.getClientAppData("parameterName").indexOf("{}")));
                vm.setClientAppData("parameterName",vm.getClientAppData("parameterName")+(new Date().getTime()));

                vm.setClientAppData("componentLabelMode","copy");
                vm.setClientAppData("componentLabelAction","Paste");
                vm.setClientAppData("bShowLabelDialog",true);
            }
            else
            {
                vm.broadcastEvent(vm.copyObjectParameterEvent); 
            }
            return;
        }
        else
        if(vm.getClientAppData("clipboardState").mode == "move" && vm.getClientAppData("clipboardState").component != null && vm.getClientAppData("clipboardState").component.length>0)      
        {
            var moveEvent = Object.assign({},{
              "message":"moveParameter",
              "srcObjectPath":trueSrcObjectPath,//parent path from which object is dragged
              "name":nodeName,
              "fullDestObjectPath":destObjectPath,//full object path at new destination
              "destObjectPath":trueDestObjectPath,//parent path to which object will be dropped
              "preceedingParam":preceedingParam,
              "hitMode":hitMode
            });
            vm.broadcastEvent(moveEvent); 
            //vm.clipboardState.mode = "copy";//reset
            //vm.clipboardState.component = null;
          	vm.setClientAppData("clipboardState",{"mode":"copy","component":null});
        }
    }
    addComponentProperty(activeComponent,propName){
        var vm = this;
        vm.setClientAppData("activeConfigComponent",activeComponent);
        var component = this.getClientAppData().composerDOM[activeComponent];

        var handlerQueueId = new Date().getTime();
        var resolver = {"resolve":function(event){
            var schema = event.data.response;

            for(var prop in schema.properties)
            {
                if(!prop.startsWith("solvent_") && !prop.startsWith("$"))
                {
                    if(prop == propName)
                    {
                        vm.onAddSchemaProp({
                          "schema":schema.properties[prop],
                          "name":prop,
                          "schemaPath":vm.joinSchemaPath(component.schemaPath,"#/properties/"+prop)
                        });
                        return;
                    }
                }
            }
        }};
        vm.eventHandlerQueue[handlerQueueId] = resolver;
        //get component schema
        var callSchemaEvent = Object.assign({},{
          "message":"callSchema",
          "handlerQueueId":handlerQueueId,
          "schemaPath":component.xsolvent_object_schema,
          "objectPath":activeComponent
        });
        vm.broadcastEvent(callSchemaEvent);   
    }
  
  
  
  
  	////////////////////////////////////////////////////////////////////////////////////
  	//Utility functions.
  	////////////////////////////////////////////////////////////////////////////////////  
    assembleNodeYield(containerNode){
        var buffer = [];
        for(var key in containerNode)
        {
           var childNode = containerNode[key];
           if(typeof childNode == "object" && childNode)
           {
              for(var key1 in childNode)
              {
                 var potentialYieldNode = childNode[key1];
                 if(typeof potentialYieldNode == "object" && potentialYieldNode && potentialYieldNode['solvent_object_type'])
                 {
                     if(potentialYieldNode['solvent_object_type'].endsWith("NodeYield{}"))
                         buffer.push(potentialYieldNode.yield);
                 } 
              }         
           }      
        }  
        return buffer.join("");
    }
    setNodeDescriptions(node){
      for(var key in node)
      {
         var childNode = node[key];
         if(typeof childNode == "object" && childNode)
         {
            if(childNode["xsolvent_object_type"] && childNode["xsolvent_object_type"].endsWith("NodeFrameDescription{}"))
            {
                if(typeof this.getClientAppData().composerDOM[childNode.xsolvent_radkit_composer_node_path] == "undefined")
                        this.getClientAppData().composerDOM[childNode.xsolvent_radkit_composer_node_path] = childNode;          	
            }
            else
            this.setNodeDescriptions(childNode);
         }
      }
    }
    getNodeYield(containerNode){
        for(var key in containerNode)
        {
            var potentialYieldNode = containerNode[key];
            if(typeof potentialYieldNode == "object" && potentialYieldNode && potentialYieldNode['solvent_object_type'])
            {
                if(potentialYieldNode['solvent_object_type'].endsWith("NodeYield{}"))
                  return potentialYieldNode.yield;
            }
        }  
        return "";
    }
    whereIsMouse(event){
       var pWidth = $(event.target).innerWidth(); //use .outerWidth() if you want borders
       var pOffset = $(event.target).offset(); 
       var x = event.pageX - pOffset.left;
       var seg = pWidth/3;
        if(seg > x)
            return "left";
        else
        if( x>seg && (seg*2)> x)
            return "middle";  
        else
            return "right";  
    }
    getObjectByType(containerNode,type){
        for(var key in containerNode)
        {
            var potentialYieldNode = containerNode[key];
            if(typeof potentialYieldNode == "object" && potentialYieldNode && potentialYieldNode['solvent_object_type'])
            {
                if(potentialYieldNode['solvent_object_type'].endsWith(type))
                {
                  if(typeof potentialYieldNode["xsolvent_node_path"] == "undefined")
                    potentialYieldNode = Object.assign(potentialYieldNode,{"xsolvent_node_path":"/"+key});

                  return potentialYieldNode;
                }
            }
            else
            if(typeof potentialYieldNode == "object" && potentialYieldNode && potentialYieldNode['xsolvent_object_type'])
            {
                if(potentialYieldNode['xsolvent_object_type'].endsWith(type))
                {
                  if(typeof potentialYieldNode["xsolvent_node_path"] == "undefined")
                    potentialYieldNode = Object.assign(potentialYieldNode,{"xsolvent_node_path":"/"+key});

                  return potentialYieldNode;
                }
            }
        }  
        return null;
    }
    findRenderedNode(nodePath, allowTemplate){
        //given a nodePath, find the first parent node on that path that represents a UI component
        var curPath = nodePath;
        //console.log(this.getClientAppData().composerDOM);
        while(true)
        {
            if(this.getClientAppData().composerDOM[curPath] && 
               (allowTemplate || this.getClientAppData().composerDOM[curPath].xsolvent_radkit_composer_markupTag != "template"))
                return Object.assign({},{"path":curPath,"component":this.getClientAppData().composerDOM[curPath]});

            curPath = curPath.substring(0,curPath.lastIndexOf("/"));
            if(curPath.length == 0)
              break;
        }  
        return null;
    }
  	
    onMouseEnterComponent(event,componentNodePath){
       var vm = this;

       //reset
       vm.setClientAppData("tilingState",Object.assign({},{"self":false,
           "directChildren":false,
           "directTilableChildren":false,
           "allChildren":false,
           "allTilableChildren":false}));

       if(vm.getClientAppData("enableMouseEnterAwareness"))
       {
            event.stopPropagation();
            vm.setClientAppData("activeComponent",componentNodePath);
            $("#solvent_lastmile_mouseenter_indicator").position({
              my:"left top",
              at:"right+5 top",
              of:event//.target
            }).css({"display":"block"});
            var component = vm.getClientAppData().composerDOM[vm.getClientAppData("activeComponent")];
            vm.setClientAppData("activeComponentTag",component.xsolvent_radkit_composer_markupTag);

            if(component.tilingState)//set UI state using component state
               vm.mergeObjects(vm.getClientAppData("tilingState"),component.tilingState);
            else
            {//use default UI state for component state
               component.tilingState = Object.assign({},vm.getClientAppData("tilingState"));  
            }
       }

       if($(event.target).hasClass("lastmile-visual-tile"))
       {
            event.stopPropagation();
            $(event.target).addClass("lastmile-visual-tile-active-background");
       }    

       if($(event.target).hasClass("lastmile-visual-shape"))
       {
            event.stopPropagation();
            $(event.target).addClass("lastmile-visual-shape-active-background");
       }   

       if($(event.target).hasClass("lastmile-visual-slot"))
       {
            event.stopPropagation();
            $(event.target).addClass("lastmile-visual-slot-active-background");
       }   
    }
    showComponentConfigurationWindow(){
        var vm = this;
        vm.setClientAppData("showConfigurationDialog",true);
        var component = this.getClientAppData().composerDOM[vm.getClientAppData("activeComponent")];
        //fetch component schema and prepare configuration UI
        var callSchemaEvent = Object.assign({},{
          "message":"callSchema",
          "schemaPath":component.xsolvent_object_schema+"#/properties/Settings",
          "objectPath":vm.getClientAppData("activeComponent")
        });
        vm.broadcastEvent(callSchemaEvent);   

        callSchemaEvent = Object.assign({},{
          "message":"callSchema",
          "schemaPath":component.xsolvent_object_schema+"#/properties/Events",
          "objectPath":vm.getClientAppData("activeComponent")
        });
        vm.broadcastEvent(callSchemaEvent);  

        callSchemaEvent = Object.assign({},{
          "message":"callSchema",
          "schemaPath":component.xsolvent_object_schema+"#/properties/Directives",
          "objectPath":vm.getClientAppData("activeComponent")
        });
        vm.broadcastEvent(callSchemaEvent);  

        callSchemaEvent = Object.assign({},{
          "message":"callSchema",
          "schemaPath":component.xsolvent_object_schema+"#/properties/Data Model",
          "objectPath":vm.getClientAppData("activeComponent")
        });  
        vm.broadcastEvent(callSchemaEvent);

        callSchemaEvent = Object.assign({},{
          "message":"callSchema",
          "schemaPath":component.xsolvent_object_schema+"#/properties/Markup",
          "objectPath":vm.getClientAppData("activeComponent")
        });
        vm.broadcastEvent(callSchemaEvent);  
    }
    openComponentNode(activeComponent,mode){
        var vm = this;
        var openNodeEvent = Object.assign({},{
          "message":"openNode",  
          "mode":mode?mode:"open-in-graph",
          "objectPath":activeComponent	
        });
        this.broadcastEvent(openNodeEvent);
    }
    getObjectListByType(containerNode,type){
        var result = [];
        for(var key in containerNode)
        {
            var potentialYieldNode = containerNode[key];
            if(typeof potentialYieldNode == "object" && potentialYieldNode && potentialYieldNode['solvent_object_type'])
            {
                if(potentialYieldNode['solvent_object_type'].endsWith(type))
                {
                  if(typeof potentialYieldNode["xsolvent_node_path"] == "undefined")
                    potentialYieldNode = Object.assign(potentialYieldNode,{"xsolvent_node_path":"/"+key});
                  result.push(potentialYieldNode);
                }
            }
            else
            if(typeof potentialYieldNode == "object" && potentialYieldNode && potentialYieldNode['xsolvent_object_type'])
            {
                if(potentialYieldNode['xsolvent_object_type'].endsWith(type))
                {
                  if(typeof potentialYieldNode["xsolvent_node_path"] == "undefined")
                    potentialYieldNode = Object.assign(potentialYieldNode,{"xsolvent_node_path":"/"+key});

                  result.push(potentialYieldNode);
                }
            }
        }  
        return result;
    }
    getObjectMapByType(containerNode,type){
        var result = {};
        for(var key in containerNode)
        {
            var potentialYieldNode = containerNode[key];
            if(typeof potentialYieldNode == "object" && potentialYieldNode && potentialYieldNode['solvent_object_type'])
            {
                if(potentialYieldNode['solvent_object_type'].endsWith(type))
                {
                  if(typeof potentialYieldNode["xsolvent_node_path"] == "undefined")
                    potentialYieldNode = Object.assign(potentialYieldNode,{"xsolvent_node_path":"/"+key});

                  result[key] = potentialYieldNode;
                }
            }
            else
            if(typeof potentialYieldNode == "object" && potentialYieldNode && potentialYieldNode['xsolvent_object_type'])
            {
                if(potentialYieldNode['xsolvent_object_type'].endsWith(type))
                {
                  if(typeof potentialYieldNode["xsolvent_node_path"] == "undefined")
                    potentialYieldNode = Object.assign(potentialYieldNode,{"xsolvent_node_path":"/"+key});

                  result[key] = potentialYieldNode;
                }
            }
        }  
        return result;
    }
    copyComponent(copyAs,activeComponent){
      var vm = this;
      //vm.clipboardState.component = activeComponent;
      //vm.clipboardState.copyAs = copyAs;
      //vm.clipboardState.mode = "copy";
      vm.setClientAppData("clipboardState",{
        "mode":"copy",
        "component":activeComponent,
        "copyAs":copyAs});
    }
    copyUIComponent(){
        var vm = this;
        vm.copyObjectParameterEvent = Object.assign(vm.copyObjectParameterEvent,{"pasteAs":this.getClientAppData("parameterName")+"{}"});
        this.broadcastEvent(vm.copyObjectParameterEvent);
        vm.copyObjectParameterEvent = null;
    }
    setComponentLabel(event){
        if(this.getClientAppData("componentLabelMode") == "new")
            this.addUIComponent(this.getClientAppData("parameterName"));
        else
        if(this.getClientAppData("componentLabelMode") == "rename")
            this.renameUIComponent(this.getClientAppData("parameterName"));
        else
        if(this.getClientAppData("componentLabelMode") == "copy")
            this.copyUIComponent(this.getClientAppData("parameterName"));

        this.setClientAppData("bShowLabelDialog",false);
        this.setClientAppData("parameterName","");
    }
    joinSchemaPath(basePath,fragmentPath){
        if(basePath.indexOf("#/") != -1)
           return basePath+fragmentPath.substring(1);

        return basePath+fragmentPath;
    }
    onMouseOutComponent(event){
        if(this.getClientAppData("enableMouseEnterAwareness"))
        {      

        }

        if($(event.target).hasClass("lastmile-visual-tile"))
        {
          //event.stopPropagation();
          $(event.target).removeClass("lastmile-visual-tile-active-background");
        }

        if($(event.target).hasClass("lastmile-visual-shape"))
        {
          //event.stopPropagation();
          $(event.target).removeClass("lastmile-visual-shape-active-background");
        }  

        if($(event.target).hasClass("lastmile-visual-slot"))
        {
          //event.stopPropagation();
          $(event.target).removeClass("lastmile-visual-slot-active-background");
        }    
    }
    applyTiling(directiveName,activeComponentPath){
        var vm = this;
        var dfd = new $.Deferred();
        var component = null;
        var activeComponent = activeComponentPath;
        if(directiveName == "parent")
           activeComponent =  activeComponent.substring(0,activeComponent.lastIndexOf("/"));

      	console.log("applyTiling:"+vm.getClientAppData("activeComponent"));
      

        if(typeof activeComponent == "string")
          component = vm.getClientAppData().composerDOM[activeComponent];
        else
        if(typeof activeComponent == "object")
          component = activeComponent;
        else
          component = vm.getClientAppData().composerDOM[vm.getClientAppData("activeComponent")];

        var tilingDirective = directiveName == "parent"?"self":directiveName;

        if(typeof component.tilingState == "undefined" || component.tilingState == null)
           component.tilingState = Object.assign({},vm.getClientAppData("tilingState"));  

        if(!vm.getClientAppData("tilingState")[tilingDirective] && directiveName != "parent")
        {
           vm.getClientAppData("tilingState")[tilingDirective] = component.tilingState[tilingDirective];
           tilingDirective = "disable-"+tilingDirective;
        }
        else
        {
           component.tilingState[tilingDirective] = true; 
        }

        var nodePath = component.xsolvent_radkit_composer_node_path;

        vm.radkitServer(
          vm.getNodeURLPath(nodePath),
          nodePath,
          {"solvent_radkit_composer_tiling_directive":tilingDirective})
          .then(function(reply){
             dfd.resolve(reply);
          });
        return dfd.promise();
    }
    initUIBuilder(){
        var url_string = window.location.href;
        var url = new URL(url_string);
        var messageChannelID = url.searchParams.get("messageChannelID");
        this.pageMessageChannelID = messageChannelID+"-"+(new Date().getTime());

        this.bc = new BroadcastChannel(messageChannelID);
        this.bc.addEventListener("message",this.messageController); 

        var getAppObjectEvent = Object.assign({},{
          "message":"getAppObject",
          "pageMessageChannelID":this.pageMessageChannelID
        });
        this.broadcastEvent(getAppObjectEvent);  

        var uiEvent = Object.assign({},{
          "message":"unBlockUI",
          "pageMessageChannelID":this.pageMessageChannelID
        });
        this.broadcastEvent(uiEvent);    
    }
    findComponentByTag(tag){
       var result = [];
       for(var k in this.getClientAppData().composerDOM)
       {
           if(this.getClientAppData().composerDOM[k].xsolvent_radkit_composer_markupTag == tag)
               result.push(this.getClientAppData().composerDOM[k]);
       }
       return result;
    }
    mergeObjects(destObject,srcObject){
        var vm = this;
        for(var srcKey in srcObject)
        {
             if(destObject[srcKey] && typeof destObject[srcKey] == "object"  && typeof srcObject[srcKey] == "object")
               vm.mergeObjects(destObject[srcKey],srcObject[srcKey]);
             else
               destObject[srcKey] = srcObject[srcKey];         
        }
    }
    getContainerDraggable(srcNodePath){
        var vm = this;
        var srcContainerNodePath = srcNodePath.substring(0,srcNodePath.lastIndexOf("{}"));
        srcContainerNodePath = srcContainerNodePath.substring(0,srcContainerNodePath.lastIndexOf("/"));

        var srcContainer  = vm.getClientAppData("DnDcontainers")[srcContainerNodePath];
        var srcNode 	  = null;
        for(var d=0;d<srcContainer.draggables.length;d++)
        {
           if(srcContainer.draggables[d].path == srcNodePath) 
           {
              return srcContainer.draggables[d];
           }      
        }
        return null;
    }
    sendRadkitMessage(objectFramePath,reqParam){
       var vm = this;
       var dfd = new $.Deferred();
       var compilerEndPoint = objectFramePath.substring(0,objectFramePath.indexOf("{}")+2);
       var param = {
           "solvent_radkit_composer_action":"compile-node"
       };
       if(reqParam)
            param = Object.assign(param,reqParam);

       $.ajax({
                method: "POST",
                url: compilerEndPoint,
                data:param,
                dataType:"json"
       })
                .done(function( reply ) {

                dfd.resolve(reply);
        });        
        return dfd.promise();
     }
    onMouseEnterShape(event){
        event.stopPropagation();
        $(event.target).addClass("lastmile-visual-shape-active-background");
    }
    onMouseLeaveShape(event){    
      event.stopPropagation();    
      $(event.target).removeClass("lastmile-visual-shape-active-background");
    }
    onShowBookmarks(activeComponent){
        var vm = this;
        vm.setClientAppData("activeConfigComponent",activeComponent);
        var component = this.getClientAppData().composerDOM[activeComponent];

        var handlerQueueId = new Date().getTime();
        var resolver = {"resolve":function(event){
            vm.setClientAppData("activeComponentBookmarks",event.data.response.bookmarks.files);
        }};
        vm.eventHandlerQueue[handlerQueueId] = resolver;
        //get component bookmarks
        var callSchemaEvent = Object.assign({},{
          "message":"loadObjectBookmarks",
          "handlerQueueId":handlerQueueId,
          "objectPath":activeComponent
        });
        vm.broadcastEvent(callSchemaEvent);   
    }
    onOpenBookmark(bookmarkEntry){
        var vm = this;
        var activeComponent = vm.getClientAppData("activeConfigComponent");  
        var component = this.getClientAppData().composerDOM[activeComponent];

        var handlerQueueId = new Date().getTime();
        var resolver = {"resolve":function(event){

        }};
        vm.eventHandlerQueue[handlerQueueId] = resolver;
        //get component bookmarks
        var callSchemaEvent = Object.assign({},{
          "message":"openResource",
          "handlerQueueId":handlerQueueId,
          "targetPath":bookmarkEntry.bookmark.target
        });
        vm.broadcastEvent(callSchemaEvent); 
    }
    stripObjectIndex(objectPath){
        if(objectPath.endsWith("/index.ins"))
          return objectPath.substring(0,objectPath.lastIndexOf("/"));

        return objectPath;
    }
    stripLeadingTag(markup){
        var inQuote = false;
        for(var i=0;i<markup.length;i++)
        {
           if(markup[i] == '"' || markup[i] == "'")
             inQuote = !inQuote;
           else
           if(markup[i] == '>' && !inQuote)
             return markup.substring(i+1);       
        }
        return markup;
    }
    getPaletteItem(path,srcObject){
       var vm = this;
       if(path.length>1)
         return vm.getPaletteItem(path.slice(1),srcObject[path[0]]);

       return srcObject[path[0]];
    }
    getNodeURLPath(nodePath){
        var vm = this;
        if(vm.appDefinition && vm.appDefinition.contextPath == "/ide-proxy"){

          var url_string = window.location.href;
          var url = new URL(url_string);
          var repoId = url.searchParams.get("repoId");

          return (vm.appDefinition.contextPath+"/"+repoId+nodePath).replace("//","/");
        }
        else
        if(vm.appDefinition){

          return (vm.appDefinition.contextPath+ nodePath).replace("//","/");
        }  
        return nodePath;
    }
    fetchComponentSchema(activeComponent,schemaPath){
        var vm = this;
        var dfd = new $.Deferred();

        var component = this.getClientAppData().composerDOM[activeComponent];  
        var handlerQueueId = new Date().getTime();
        var resolver = {"resolve":function(event){
            var schema = event.data.response;
            dfd.resolve(schema);
        }};
        vm.eventHandlerQueue[handlerQueueId] = resolver;
        //get component schema
        var callSchemaEvent = Object.assign({},{
          "message":"callSchema",
          "handlerQueueId":handlerQueueId,
          "schemaPath":schemaPath?vm.joinSchemaPath(component.xsolvent_object_schema,schemaPath):component.xsolvent_object_schema,
          "objectPath":activeComponent
        });
        vm.broadcastEvent(callSchemaEvent);
        return dfd.promise();
    }
    switchActiveComponentContext(){
       var vm = this;
       var component =  null;
       var firstRenderedParent = vm.findRenderedNode(vm.getClientAppData("activeComponent").substring(0,vm.getClientAppData("activeComponent").lastIndexOf("/")),true);
       if(firstRenderedParent)
       {
          component = firstRenderedParent.component;
          vm.setClientAppData("activeComponent",firstRenderedParent.path);
       }
       else
       return;

       vm.setClientAppData("activeComponentTag",component.xsolvent_radkit_composer_markupTag);

       //reset
	   vm.setClientAppData("tilingState",Object.assign({},{"self":false,
           "directChildren":false,
           "directTilableChildren":false,
           "allChildren":false,
           "allTilableChildren":false}));

        if(component.tilingState)//set UI state using component state
          vm.mergeObjects(vm.getClientAppData("tilingState"),component.tilingState);
        else
        {//use default UI state for component state
          component.tilingState = Object.assign({},vm.getClientAppData("tilingState"));  
        } 
    }
    insertSlotComponent(addObjectParameterEvent){
      var vm = this;
      //1. add as a sibling of the drop target
      var preceedingSiblingParam = addObjectParameterEvent.destObjectPath.substring(addObjectParameterEvent.destObjectPath.lastIndexOf("/")+1);
      addObjectParameterEvent.objectPath = addObjectParameterEvent.objectPath.substring(0,addObjectParameterEvent.objectPath.lastIndexOf("/"));
      addObjectParameterEvent.destObjectPath = addObjectParameterEvent.destObjectPath.substring(0,addObjectParameterEvent.destObjectPath.lastIndexOf("/"));
      addObjectParameterEvent.fullDestObjectPath = addObjectParameterEvent.destObjectPath+"/"+vm.getClientAppData("parameterName")+"{}";

      vm.postMessage(Object.assign(addObjectParameterEvent,{
        "message":"addParameter",
        "name":vm.getClientAppData("parameterName")+"{}",
        "parameter":{
          "name":vm.getClientAppData("parameterName"),
          "type":"crud",
          "isFinal":"yes",
          "evalRight":"yes",
          "defaultValue":vm.getClientAppData("parameterName")+"{}"
        },
        "preceedingParam":preceedingSiblingParam,
        "hitMode":"after"
      }))
        .then(function(){

        var selectedSlot = null;
        for(var si=0;si<vm.getClientAppData("droppedComponentSlots").length;si++)
        {
          if(vm.getClientAppData("droppedComponentSlots")[si].name == vm.getClientAppData("droppedComponentSelectedSlot")) 
          {
            selectedSlot = vm.getClientAppData("droppedComponentSlots")[si];
            break;
          }
        }

        //2. create a slot to which drop target will be moved
        var slotParameterName = selectedSlot?selectedSlot.name:vm.getClientAppData("droppedComponentSchema").schemaExtension.settings.wrapperDefinition.slot;

        vm.postMessage(Object.assign({},{
          "message":"addParameter",
          "name":slotParameterName+"{}",
          "parameter":{
            "name":slotParameterName,
            "type":"crud",
            "isFinal":"yes",
            "evalRight":"yes",
            "defaultValue":slotParameterName+"{}"
          },
          "schemaPath":selectedSlot?selectedSlot.schemaPath:vm.getClientAppData("droppedComponentSchema").schemaExtension.settings.wrapperDefinition.slotSchema,
          "objectPath":addObjectParameterEvent.fullDestObjectPath,
          "fullDestObjectPath":addObjectParameterEvent.fullDestObjectPath+"/"+slotParameterName+"{}",
          "destObjectPath":addObjectParameterEvent.fullDestObjectPath,
          "hitMode":"child"
        }))
          .then(function(){

          //3. move drop target to slot
          vm.postMessage(Object.assign({},{
            "message":"moveParameter",
            "srcObjectPath":addObjectParameterEvent.objectPath,//parent path from which object is dragged
            "name":preceedingSiblingParam,
            "fullDestObjectPath":addObjectParameterEvent.fullDestObjectPath+"/"+slotParameterName+"{}/"+preceedingSiblingParam,//full object path at new destination
            "destObjectPath":addObjectParameterEvent.fullDestObjectPath+"/"+slotParameterName+"{}",//parent path to which object will be dropped
            "hitMode":"child"
          }))
            .then(function(){
              //4. modify drop target if necessary

              //5. modify slot as necessary       

              vm.addObjectParameterEvent = null;
              vm.setClientAppData("parameterName","");        
          });
        });
      });


    }
    hashToPath(hashStr){
      return this.getClientAppData().composerDOMPaths[hashStr];
    }  
    enableMouseEnterAwarenessToggle(){   
      if(vm.getClientAppData("enableMouseEnterAwareness") == false){        
         $("#solvent_lastmile_mouseenter_indicator").css({"display":"none"});         
      }
      else
      {
         $("#solvent_lastmile_mouseenter_indicator").css({"display":"block"});  
      }
    }  
  	findAppRootComponent(tag){
       for(var k in this.composerDOM)
       {
           if(this.composerDOM[k].isAppUI)
               return this.composerDOM[k];
       }
       return null;
    }  
  	getBrowserParam(param){
      var url_string = window.location.href;
      var url = new URL(url_string);
      return url.searchParams.get(param);
    }  
  
	///////////////////////////////////////////////////////////////////////////////
  	//UI Hooks for editing objects from UI panels.
  	///////////////////////////////////////////////////////////////////////////////
    showComponentConfigDialog(type,activeComponent){
        var vm = this;  
        vm.setClientAppData("activeConfigComponent",activeComponent);
        var handlerQueueId = new Date().getTime();
        var component = this.getClientAppData().composerDOM[activeComponent];
        if(type == 'Properties')
        {
            vm.eventHandlerQueue[handlerQueueId] = {"resolve":function(event){
                var schema = event.data.response;            
                vm.buildComponentPropertiesDialog(schema,component);
                vm.setClientAppData("showConfigurationPropertiesDialog",true);
            }};      

            //fetch component schema and prepare configuration UI
            var callSchemaEvent = Object.assign({},{
              "message":"callSchema",
              "handlerQueueId":handlerQueueId,
              "schemaPath":vm.joinSchemaPath(component.xsolvent_object_schema,"#/properties/Settings"),
              "objectPath":activeComponent
            });
            vm.broadcastEvent(callSchemaEvent);
        }
        else
        if(type == 'Events')
        {
            vm.eventHandlerQueue[handlerQueueId] = {"resolve":function(event){
                var schema = event.data.response;            
                vm.buildComponentEventsDialog(schema,component);
                vm.setClientAppData("showConfigurationEventsDialog",true);
            }};           

            var callSchemaEvent = Object.assign({},{
              "message":"callSchema",
              "handlerQueueId":handlerQueueId,
              "schemaPath":vm.joinSchemaPath(component.xsolvent_object_schema,"#/properties/Events"),
              "objectPath":activeComponent
            });
            vm.broadcastEvent(callSchemaEvent);  
        }
        else
        if(type == 'Directives')
        {
            vm.eventHandlerQueue[handlerQueueId] = {"resolve":function(event){
                var schema = event.data.response;            
                vm.buildComponentDirectivesDialog(schema,component);
                vm.setClientAppData("showConfigurationDirectivesDialog",true);
            }};           

            var callSchemaEvent = Object.assign({},{
              "message":"callSchema",
              "handlerQueueId":handlerQueueId,
              "schemaPath":vm.joinSchemaPath(component.xsolvent_object_schema,"#/properties/Directives"),
              "objectPath":activeComponent
            });
            vm.broadcastEvent(callSchemaEvent);  
        }
        else
        if(type == 'Data Model')
        {
            vm.eventHandlerQueue[handlerQueueId] = {"resolve":function(event){
                var schema = event.data.response;            
                vm.buildComponentDataModelDialog(schema,component);
                vm.setClientAppData("showConfigurationDataModelDialog",true);
            }};           

            var callSchemaEvent = Object.assign({},{
              "message":"callSchema",
              "handlerQueueId":handlerQueueId,
              "schemaPath":vm.joinSchemaPath(component.xsolvent_object_schema,"#/properties/Data Model"),
              "objectPath":activeComponent
            });  
            vm.broadcastEvent(callSchemaEvent);
        }
        else
        if(type == 'Markup')
        {        
            vm.eventHandlerQueue[handlerQueueId] = {"resolve":function(event){
                var schema = event.data.response;            
                vm.buildComponentMarkupDialog(schema,component);
                vm.setClientAppData("showConfigurationMarkupDialog",true);
            }};     

            var callSchemaEvent = Object.assign({},{
              "message":"callSchema",
              "handlerQueueId":handlerQueueId,
              "schemaPath":vm.joinSchemaPath(component.xsolvent_object_schema,"#/properties/Markup"),
              "objectPath":activeComponent
            });
            vm.broadcastEvent(callSchemaEvent);
        }
    }
    buildComponentPropertiesDialog(schema,component){
        var vm = this;
        //prepare property list
        //a. Initialize properties via values from node
        //b. Set properties to update UI
        var settings = schema;
        var settingsValues = vm.getObjectListByType(component,"ComponentSettings{}");
        //console.log("settingsValues");
        //console.log(settingsValues);
        var properties = [];
        for(var settingsName in settings.properties)
        { 
          
          if(settingsName.startsWith("solvent_") || settingsName.startsWith("$"))//some schema resolution related junk
            continue;


          
          var prop = {"name":settingsName,"objectPath":null,"isSet":false,"value":null,"type":settings.properties[settingsName].type};

          if(settingsValues)
          {
            for(var s=0;s<settingsValues.length;s++)
            {
              //if(settingsValues[s]["xsolvent_build_artifact"])
              //  continue;

              //console.log(settingsName);
              //console.log(settingsValues[s]);
                if(typeof settingsValues[s][settingsName] != "undefined")
                {
                  prop.value = settingsValues[s][settingsName];                                
                  prop.isSet = true;
                } 

                //set an appropriate settings object target, it should not be an auto-generated build artifact.
                if(settingsValues[s]["xsolvent_node_path"] && !settingsValues[s]["xsolvent_node_path"].startsWith("/xsolvent_radkit_composer"))
                {
                    prop.objectPath = settingsValues[s]["xsolvent_node_path"];                
                }          
            }        
            //console.log(prop)
          }
          properties.push(prop);
        }
        vm.setClientAppData("configurationProperties",properties);
        console.log("configurationProperties");
        console.log(vm.getClientAppData("configurationProperties"));  
    }
    buildComponentDirectivesDialog(schema,component){
      var vm = this;
      //prepare directive list
      //a. Initialize directives via values from node
      //b. Set directives to update UI   
      var directives = schema;
      var directivesValues = vm.getObjectByType(component,"Directives{}");
      var directivesExpressions = [];
      for(var directivesName in directives.properties)
      { 
          if(directivesName.startsWith("solvent_") || settingsName.startsWith("$"))//some schema resolution related junk
            continue;
        
        var directive = {"name":directivesName,"objectPath":null,"isSet":false,"expression":null};

        if(directivesValues)
        {
            for(var d=0;d<directivesValues.length;d++)
            {
                if(directivesValues[d][directivesName])
                {
                    directive.expression = directivesValues[d][directivesName];                                
                    directive.isSet = true;
                }

                //set an appropriate directive object target, it should not be an auto-generated build artifact.
                if(directivesValues[d]["xsolvent_node_path"] && !directivesValues[d]["xsolvent_node_path"].startsWith("/xsolvent_radkit_composer"))
                {
                   directive.objectPath = directivesValues[d]["xsolvent_node_path"];            
                }         
            }         
        }
        directivesExpressions.push(directive);
      }
      vm.setClientAppData("configurationDirectives",directivesExpressions);
      console.log("configurationDirectives");
      console.log(vm.getClientAppData("configurationDirectives"));
    }
    buildComponentEventsDialog(schema,component){
      var vm = this;
      //prepare event handler list
      //a. Initialize properties via values from node
      //b. Set handlers to update UI
      var events = schema;
      var implementedEventsValues = null;
      var eventEnumerator = vm.getObjectByType(component,"AvailableComponentEvents{}");
      if(eventEnumerator != null)
        implementedEventsValues = vm.getObjectListByType(eventEnumerator,"ComponentEvent{}");

      //console.log(component);
      //console.log("implementedEventsValues");
      //console.log(implementedEventsValues);

      var eventHandlers = [];
      for(var eventsName in events.properties)
      { 
        if(eventsName.startsWith("solvent_") || eventsName.startsWith("$"))
          continue;

        var event = {"name":eventsName,"objectPath":null,"isSet":false,"code":null};

        if(implementedEventsValues != null)
        {
          for(var ie=0;ie<implementedEventsValues.length;ie++)
          {
              var implementedEvent = implementedEventsValues[ie];
              var eventSchema = implementedEvent["xsolvent_object_schema"]?implementedEvent["xsolvent_object_schema"]:implementedEvent["solvent_object_schema"];

              if(eventSchema.endsWith(eventsName))
              {
                  var eventAction = vm.getObjectByType(implementedEvent,"ComponentEventAction{}");
                  if(eventAction != null)
                  {
                      //console.log("eventAction")
                      //console.log(eventAction);                                                  
                      event.isSetAction = true;
                      event.actionObjectPath = eventAction["xsolvent_node_path"];

                      if(typeof eventAction.code != "undefined")
                      {
                          event.code = eventAction.code;                                    
                          event.isSetActionCode = true;
                      }                
                  }
                  event.isSet = true;
                  event.objectPath = implementedEvent["xsolvent_node_path"];
              }
          }
          event.isSetEnumerator = true;
          event.enumeratorObjectPath = eventEnumerator["xsolvent_node_path"];
        }
        eventHandlers.push(event);
      }
      vm.setClientAppData("configurationEvents",eventHandlers);         
      console.log("configurationEvents");
      console.log(vm.getClientAppData("configurationEvents"));
    }
    buildComponentMarkupDialog(schema,component){
      var vm = this;
      //prepare markup list
      //a. Initialize markups via values from node
      //b. Set markups to update UI   
      var markups = schema;
      var markupsValues = vm.getObjectListByType(component,"MarkupOverride{}");
      var markupsCode = [];
      for(var m=0;m<markupsValues.length;m++)
      {
          var markupsName = markupsValues[m]["xsolvent_node_path"];
          markupsName = markupsName.substring(1,markupsName.length-2);//remove / and {}
          var markup = {"name":markupsName,"objectPath":markupsValues[m]["xsolvent_node_path"],"isSet":false,"text":markupsValues[m].text};

          if(typeof markupsValues[m].text != "undefined")
            markup.isSet = true;

          markupsCode.push(markup);
      }

      vm.setClientAppData("configurationMarkups",markupsCode);
      console.log("configurationMarkups");
      console.log(vm.getClientAppData("configurationMarkups"));
      console.log(component);   
    }
    buildComponentDataModelDialog(schema,component){
      var vm = this;
      //prepare model list
      //a. Initialize models via values from node
      //b. Set models to update UI   
      var models = schema;
      var modelsValues = vm.getObjectListByType(component,"InstanceDataModel{}");
      var modelsData = [];
      for(var md=0;md<modelsValues.length;md++)
      {
        var vueModel = modelsValues[md];
        var modelsName = vueModel["xsolvent_node_path"];                    
        var model = {"name":modelsName,"objectPath":component["xsolvent_node_path"],"variables":[]};

        for(var v in vueModel)
        {
            if(!v.startsWith("xsolvent_") && !v.startsWith("solvent_"))
            {
                var variable = {"name":v,"objectPath":vueModel["xsolvent_node_path"],"type":"scalar"};
                if(vueModel[v] && typeof vueModel[v] == "object")
                {
                  variable.type = "crud";
                  variable.dataObjectPath = vueModel[v]["xsolvent_node_path"];
                }
                model.variables.push(variable);
            }
        }
        modelsData.push(model);
      }
      vm.setClientAppData("configurationModels",modelsData);
      console.log("configurationModels");
      console.log(vm.getClientAppData("configurationModels"));
      console.log(component);        

    }
  
  
    onPropertyUpdate(prop){
        var vm = this;  
        var activeComponent = vm.getClientAppData("activeConfigComponent");
        var component = vm.getClientAppData().composerDOM[activeComponent];
        console.log("onPropertyUpdate");
        console.log(component);
        var handlerQueueId = new Date().getTime();
        var resolver = {"resolve":function(event){
            console.log("message from IDE")
            console.log(event.data);      

            if(event.data.responseTo.eventQueue && event.data.responseTo.eventQueue.length>0)
            {
                var dequeuedEvent = event.data.responseTo.eventQueue[0];
                dequeuedEvent  = Object.assign(dequeuedEvent,{
                  "eventQueue":event.data.responseTo.eventQueue.slice(1),
                  "handlerQueueId":new Date().getTime()
                });
                vm.eventHandlerQueue[dequeuedEvent.handlerQueueId] = resolver;
                vm.broadcastEvent(dequeuedEvent);
                return;
            }      
            //find first UI component that this object descends from
            var renderedNode = vm.findRenderedNode(event.data.responseTo.objectPath);

            var srcSinkObjectPath = renderedNode.path;//.substring(0,renderedNode.path.lastIndexOf("/"));
            vm.radkitServer(vm.getNodeURLPath(srcSinkObjectPath),srcSinkObjectPath).
            then(function(){
              prop.isSet = true;
              //get the prop's host object's path relative to the active component
              prop.objectPath = prop.objectPath?prop.objectPath:event.data.responseTo.objectPath.substring(event.data.responseTo.objectPath.lastIndexOf("/"));
            });
        }};    
        vm.eventHandlerQueue[handlerQueueId] = resolver;


        if(prop.isSet)//both Settings{} and prop exist
        {     
            var updateParameterEvent = Object.assign({},{
              "message":"updateParameter",
              "handlerQueueId":handlerQueueId,
              "objectPath":activeComponent+prop.objectPath,
              "name":prop.name,
              "value":prop.value
            });
            vm.broadcastEvent(updateParameterEvent);  
        }
        else
        if(prop.objectPath)//if Settings{} exist
        {            
            vm.addObjectParameterEvent = Object.assign({},{
              "message":"addParameter",
              "handlerQueueId":handlerQueueId,
              "objectPath":activeComponent+prop.objectPath,
              "parameter":{
                "name":prop.name,
                "type":prop.type,
                "isFinal":"yes",
                "defaultValue":prop.value
               },
              "fullDestObjectPath":activeComponent+prop.objectPath,
              "destObjectPath":activeComponent+prop.objectPath,
              "preceedingParam":null
            });  
            vm.broadcastEvent(vm.addObjectParameterEvent);
       }
       else
       {//both Settings{} and prop need to be created
            var eventQueue = [];
            eventQueue.push(Object.assign({},{
              "message":"addParameter",          
              "objectPath":activeComponent+"/Settings{}",
              "parameter":{
                "name":prop.name,
                "type":prop.type,
                "isFinal":"yes",
                "defaultValue":prop.value
              },
              "fullDestObjectPath":activeComponent+"/Settings{}",
              "destObjectPath":activeComponent+"/Settings{}",
              "preceedingParam":null
            }));  

            vm.addObjectParameterEvent = Object.assign({},{
              "message":"addParameter",
              "handlerQueueId":handlerQueueId,
              "schemaPath":vm.joinSchemaPath(component.schemaPath,"#/properties/Settings"),
              "objectPath":activeComponent,
              "parameter":{
                    "name":"Settings",
                    "type":"crud",
                    "defaultValue":"Settings{}",
                    "isFinal":"yes",
                    "evalRight":"yes"
              },
              "fullDestObjectPath":activeComponent+"/Settings{}",
              "destObjectPath":activeComponent,
              "preceedingParam":null,
              "eventQueue":eventQueue
            });  
            vm.broadcastEvent(vm.addObjectParameterEvent);          
       }    
    }
    onEventHandlerUpdate(eventhandler,event){

        var vm = this;  
        var activeComponent = vm.getClientAppData("activeConfigComponent");
        var component = vm.getClientAppData().composerDOM[activeComponent];


        var handlerQueueId = new Date().getTime();
        var resolver = {"resolve":function(event){
            console.log("message from IDE")
            console.log(event.data);      

            if(event.data.responseTo.eventQueue && event.data.responseTo.eventQueue.length>0)
            {
                var dequeuedEvent = event.data.responseTo.eventQueue[0];
                dequeuedEvent  = Object.assign(dequeuedEvent,{
                  "eventQueue":event.data.responseTo.eventQueue.slice(1),
                  "handlerQueueId":new Date().getTime()
                });
                vm.eventHandlerQueue[dequeuedEvent.handlerQueueId] = resolver;
                vm.broadcastEvent(dequeuedEvent);
                return;
            }      
            //find first UI component that this object descends from
            var renderedNode = vm.findRenderedNode(event.data.responseTo.objectPath);

            var srcSinkObjectPath = renderedNode.path;//.substring(0,renderedNode.path.lastIndexOf("/"));
            vm.radkitServer(vm.getNodeURLPath(srcSinkObjectPath),srcSinkObjectPath).
            then(function(){
                if(true)
                {
                    eventhandler.isSetEnumerator = true;
                    eventhandler.isSet = true;
                    eventhandler.isSetAction = true;
                    eventhandler.isSetActionCode = true;

                    //get the event structure host object's path relative to the active component
                    eventhandler.enumeratorObjectPath = eventhandler.enumeratorObjectPath?eventhandler.enumeratorObjectPath:"/Events{}";
                    eventhandler.objectPath = eventhandler.objectPath?eventhandler.objectPath:eventhandler.enumeratorObjectPath+"/"+event.name+"{}";
                    eventhandler.actionObjectPath = eventhandler.actionObjectPath?eventhandler.actionObjectPath:eventhandler.objectPath+"/Action{}";
                }
            });
        }};    
        vm.eventHandlerQueue[handlerQueueId] = resolver;



        if(eventhandler.isSetEnumerator && eventhandler.isSet && eventhandler.isSetAction && eventhandler.isSetActionCode)
        {//Events{}/Event{}/Action{}#code exists
            var updateParameterEvent = Object.assign({},{
              "message":"updateParameter",
              "handlerQueueId":handlerQueueId,
              "objectPath":activeComponent/*+eventhandler.enumeratorObjectPath+eventhandler.objectPath*/+eventhandler.actionObjectPath,
              "name":"code",
              "value":eventhandler.code
            });
            vm.broadcastEvent(updateParameterEvent);  
        }
        else
        if(eventhandler.isSetEnumerator && eventhandler.isSet && eventhandler.isSetAction)
        {//Events{}/Event{}/Action{} exists

                vm.addObjectParameterEvent = Object.assign({},{
                  "message":"addParameter",
                  "handlerQueueId":handlerQueueId,
                  "objectPath":activeComponent/*+eventhandler.enumeratorObjectPath*/+eventhandler.actionObjectPath,
                  "parameter":{
                    "name":"code",
                    "type":"javascript",
                    "isFinal":"yes",
                    "defaultValue":eventhandler.code
                  },
                  "fullDestObjectPath":activeComponent/*+eventhandler.enumeratorObjectPath*/+eventhandler.actionObjectPath,
                  "destObjectPath":activeComponent/*+eventhandler.enumeratorObjectPath*/+eventhandler.actionObjectPath,
                  "preceedingParam":null
                });            

                vm.broadcastEvent(vm.addObjectParameterEvent);   
        }  
        else
        if(eventhandler.isSetEnumerator && eventhandler.isSet)
        {//Events{}/Event{} exists
                var eventQueue = [];
                eventQueue.push(Object.assign({},{
                  "message":"addParameter",
                  "objectPath":activeComponent/*+eventhandler.enumeratorObjectPath*/+eventhandler.objectPath+"/Action{}",
                  "parameter":{
                    "name":"code",
                    "type":"javascript",
                    "isFinal":"yes",
                    "defaultValue":eventhandler.code
                  },
                  "fullDestObjectPath":activeComponent/*+eventhandler.enumeratorObjectPath*/+eventhandler.objectPath+"/Action{}",
                  "destObjectPath":activeComponent/*+eventhandler.enumeratorObjectPath*/+eventhandler.objectPath+"/Action{}",
                  "preceedingParam":null
                }));            

                vm.addObjectParameterEvent = Object.assign({},{
                  "message":"addParameter",
                  "handlerQueueId":handlerQueueId,
                  "schemaPath":vm.joinSchemaPath(component.schemaPath,"#/properties/Events/properties/"+eventhandler.name+"/properties/Take Action"),
                  "objectPath":activeComponent/*+eventhandler.enumeratorObjectPath*/+eventhandler.objectPath,
                  "parameter":{
                    "name":"Action",
                    "type":"crud",
                    "defaultValue":"Action{}",
                    "isFinal":"yes",
                    "evalRight":"yes"
                  },
                  "fullDestObjectPath":activeComponent/*+eventhandler.enumeratorObjectPath*/+eventhandler.objectPath+"/Action{}",
                  "destObjectPath":activeComponent/*+eventhandler.enumeratorObjectPath*/+eventhandler.objectPath,
                  "preceedingParam":null,
                  "eventQueue":eventQueue
                });
                vm.broadcastEvent(vm.addObjectParameterEvent);    
        }
        else
        if(eventhandler.isSetEnumerator)
        {//Events{} exist
                var eventQueue = [];
                eventQueue.push(Object.assign({},{
                  "message":"addParameter",
                  "schemaPath":vm.joinSchemaPath(component.schemaPath,"#/properties/Events/properties/"+eventhandler.name+"/properties/Take Action"),
                  "objectPath":activeComponent+eventhandler.enumeratorObjectPath+"/"+eventhandler.name+"{}",
                  "parameter":{
                    "name":"Action",
                    "type":"crud",
                    "defaultValue":"Action{}",
                    "isFinal":"yes",
                    "evalRight":"yes"
                  },
                  "fullDestObjectPath":activeComponent+eventhandler.enumeratorObjectPath+"/"+eventhandler.name+"{}/Action{}",
                  "destObjectPath":activeComponent+eventhandler.enumeratorObjectPath+"/"+eventhandler.name+"{}",
                  "preceedingParam":null
                }));      

                eventQueue.push(Object.assign({},{
                  "message":"addParameter",
                  "objectPath":activeComponent+eventhandler.enumeratorObjectPath+"/"+eventhandler.name+"{}/Action{}",
                  "parameter":{
                    "name":"code",
                    "type":"javascript",
                    "isFinal":"yes",
                    "defaultValue":eventhandler.code
                  },
                  "fullDestObjectPath":activeComponent+eventhandler.enumeratorObjectPath+"/"+eventhandler.name+"{}/Action{}",
                  "destObjectPath":activeComponent+eventhandler.enumeratorObjectPath+"/"+eventhandler.name+"{}/Action{}",
                  "preceedingParam":null
                }));          

                vm.addObjectParameterEvent = Object.assign({},{
                  "message":"addParameter",
                  "handlerQueueId":handlerQueueId,
                  "schemaPath":vm.joinSchemaPath(component.schemaPath,"#/properties/Events/properties/"+eventhandler.name),
                  "objectPath":activeComponent+eventhandler.enumeratorObjectPath,
                  "parameter":{
                    "name":eventhandler.name,
                    "type":"crud",
                    "defaultValue":eventhandler.name+"{}",
                    "isFinal":"yes",
                    "evalRight":"yes"
                  },
                  "fullDestObjectPath":activeComponent+eventhandler.enumeratorObjectPath+"/"+eventhandler.name+"{}",
                  "destObjectPath":activeComponent+eventhandler.enumeratorObjectPath,
                  "preceedingParam":null,
                  "eventQueue":eventQueue
                });
                vm.broadcastEvent(vm.addObjectParameterEvent);    
        }
        else
        {//we need to create the whole structure for Events{}/Event{}/TakeAction{}

                var eventQueue = [];
                eventQueue.push(Object.assign({},{
                  "message":"addParameter",
                  "schemaPath":vm.joinSchemaPath(component.schemaPath,"#/properties/Events/properties/"+eventhandler.name),
                  "objectPath":activeComponent+"/Events{}",
                  "parameter":{
                    "name":eventhandler.name,
                    "type":"crud",
                    "defaultValue":eventhandler.name+"{}",
                    "isFinal":"yes",
                    "evalRight":"yes"
                  },
                  "fullDestObjectPath":activeComponent+"/Events{}/"+eventhandler.name+"{}",
                  "destObjectPath":activeComponent+"/Events{}",
                  "preceedingParam":null
                }));      
                eventQueue.push(Object.assign({},{
                  "message":"addParameter",
                  "schemaPath":vm.joinSchemaPath(component.schemaPath,"#/properties/Events/properties/"+eventhandler.name+"/properties/Take Action"),
                  "objectPath":activeComponent+"/Events{}/"+eventhandler.name+"{}",
                  "parameter":{
                    "name":"Action",
                    "type":"crud",
                    "defaultValue":"Action{}",
                    "isFinal":"yes",
                    "evalRight":"yes"
                  },
                  "fullDestObjectPath":activeComponent+"/Events{}/"+eventhandler.name+"{}/Action{}",
                  "destObjectPath":activeComponent+"/Events{}/"+eventhandler.name+"{}",
                  "preceedingParam":null
                }));

                eventQueue.push(Object.assign({},{
                  "message":"addParameter",
                  "objectPath":activeComponent+"/Events{}/"+eventhandler.name+"{}/Action{}",
                  "parameter":{
                    "name":"code",
                    "type":"javascript",
                    "isFinal":"yes",
                    "defaultValue":eventhandler.code
                  },
                  "fullDestObjectPath":activeComponent+"/Events{}/"+eventhandler.name+"{}/Action{}",
                  "destObjectPath":activeComponent+"/Events{}/"+eventhandler.name+"{}/Action{}",
                  "preceedingParam":null
                }));

                vm.addObjectParameterEvent = Object.assign({},{
                  "message":"addParameter",
                  "handlerQueueId":handlerQueueId,
                  "schemaPath":vm.joinSchemaPath(component.schemaPath,"#/properties/Events"),
                  "objectPath":activeComponent,
                  "parameter":{
                    "name":"Events",
                    "type":"crud",
                    "defaultValue":"Events{}",
                    "isFinal":"yes",
                    "evalRight":"yes"
                  },
                  "fullDestObjectPath":activeComponent+"/Events{}",
                  "destObjectPath":activeComponent,
                  "preceedingParam":null,
                  "eventQueue":eventQueue
                });      
                vm.broadcastEvent(vm.addObjectParameterEvent);    
        }
    }
    onDirectiveUpdate(directive,directiveType){
        var vm = this;  
        var activeComponent = vm.getClientAppData("activeConfigComponent");
        var component = vm.getClientAppData().composerDOM[activeComponent];
        console.log("onDirectiveUpdate");
        console.log(component);
        var handlerQueueId = new Date().getTime();
        var resolver = {"resolve":function(event){
            console.log("message from IDE")
            console.log(event.data);      

            if(event.data.responseTo.eventQueue && event.data.responseTo.eventQueue.length>0)
            {
                var dequeuedEvent = event.data.responseTo.eventQueue[0];
                dequeuedEvent  = Object.assign(dequeuedEvent,{
                  "eventQueue":event.data.responseTo.eventQueue.slice(1),
                  "handlerQueueId":new Date().getTime()
                });
                vm.eventHandlerQueue[dequeuedEvent.handlerQueueId] = resolver;
                vm.broadcastEvent(dequeuedEvent);
                return;
            }      
            //find first UI component that this object descends from
            var renderedNode = vm.findRenderedNode(event.data.responseTo.objectPath);

            var srcSinkObjectPath = renderedNode.path;//.substring(0,renderedNode.path.lastIndexOf("/"));
            vm.radkitServer(vm.getNodeURLPath(srcSinkObjectPath),srcSinkObjectPath).
            then(function(){
              directive.isSet = true;
              //get the prop's host object's path relative to the active component
              directive.objectPath = directive.objectPath?directive.objectPath:event.data.responseTo.objectPath.substring(event.data.responseTo.objectPath.lastIndexOf("/"));
            });
        }};    
        vm.eventHandlerQueue[handlerQueueId] = resolver;


        if(directive.isSet)//both Directives{} and directive exist
        {
            var updateParameterEvent = Object.assign({},{
              "message":"updateParameter",
              "handlerQueueId":handlerQueueId,
              "objectPath":activeComponent+directive.objectPath,
              "name":directive.name,
              "value":directive.expression
            });
            vm.broadcastEvent(updateParameterEvent);  
        }
        else
        if(directive.objectPath)//if Directive{} exist
        {            
            vm.addObjectParameterEvent = Object.assign({},{
              "message":"addParameter",
              "handlerQueueId":handlerQueueId,
              "objectPath":activeComponent+directive.objectPath,
              "parameter":{
                "name":directive.name,
                "type":"string",
                "isFinal":"yes",
                "defaultValue":directive.expression
               },
              "fullDestObjectPath":activeComponent+directive.objectPath,
              "destObjectPath":activeComponent+directive.objectPath,
              "preceedingParam":null
            });  
            vm.broadcastEvent(vm.addObjectParameterEvent);
       }
       else
       {//both Directives{} and directive need to be created
            var eventQueue = [];
            eventQueue.push(Object.assign({},{
              "message":"addParameter",
              "objectPath":activeComponent+"/Directives{}",
              "parameter":{
                "name":directive.name,
                "type":"string",
                "isFinal":"yes",
                "defaultValue":directive.expression
              },
              "fullDestObjectPath":activeComponent+"/Directives{}",
              "destObjectPath":activeComponent+"/Directives{}",
              "preceedingParam":null
            }));  

            vm.addObjectParameterEvent = Object.assign({},{
              "message":"addParameter",
              "handlerQueueId":handlerQueueId,
              "schemaPath":vm.joinSchemaPath(component.schemaPath,"#/properties/Directives"),
              "objectPath":activeComponent,
              "parameter":{
                    "name":"Directives",
                    "type":"crud",
                    "defaultValue":"Directives{}",
                    "isFinal":"yes",
                    "evalRight":"yes"
              },
              "fullDestObjectPath":activeComponent+"/Directives{}",
              "destObjectPath":activeComponent,
              "preceedingParam":null,
              "eventQueue":eventQueue
            });  
            vm.broadcastEvent(vm.addObjectParameterEvent);          
       }
    }
    onUpdateMarkup(markup,event){
        var vm = this;  
        var activeComponent = vm.getClientAppData("activeConfigComponent");
        var component = vm.getClientAppData().composerDOM[activeComponent];


        console.log("onMarkupUpdate");
        console.log(component);
        var handlerQueueId = new Date().getTime();
        var resolver = {"resolve":function(event){
            console.log("message from IDE")
            console.log(event.data);      

            if(event.data.responseTo.eventQueue && event.data.responseTo.eventQueue.length>0)
            {
                var dequeuedEvent = event.data.responseTo.eventQueue[0];
                dequeuedEvent  = Object.assign(dequeuedEvent,{
                  "eventQueue":event.data.responseTo.eventQueue.slice(1),
                  "handlerQueueId":new Date().getTime()
                });
                vm.eventHandlerQueue[dequeuedEvent.handlerQueueId] = resolver;
                vm.broadcastEvent(dequeuedEvent);
                return;
            }      
            //find first UI component that this object descends from
            var renderedNode = vm.findRenderedNode(event.data.responseTo.objectPath);

            var srcSinkObjectPath = renderedNode.path;//.substring(0,renderedNode.path.lastIndexOf("/"));
            vm.radkitServer(vm.getNodeURLPath(srcSinkObjectPath),srcSinkObjectPath).
            then(function(){
                if(markup)
                {
                    markup.isSet = true;
                }
                else
                {
                    var markupObjectPath = event.data.responseTo.objectPath.substring(event.data.responseTo.objectPath.lastIndexOf("/"));
                    var markupName =  markupObjectPath.substring(1,markupObjectPath.length-2);
                    var newMarkup  = {"name":markupName,"objectPath":markupObjectPath,"isSet":true,"text":vm.getClientAppData("configurationMarkupText")};
                    vm.getClientAppData("configurationMarkups").push(newMarkup);
                }
            });
        }};    
        vm.eventHandlerQueue[handlerQueueId] = resolver;


        if(markup && markup.isSet)//both Markup{} and markup exist
        {
            var updateParameterEvent = Object.assign({},{
              "message":"updateParameter",
              "handlerQueueId":handlerQueueId,
              "objectPath":activeComponent+markup.objectPath,
              "name":"text",
              "value":markup.text
            });
            vm.broadcastEvent(updateParameterEvent);  
        }
        else
        if(markup && markup.objectPath)//if Markup{} exist
        {            
            vm.addObjectParameterEvent = Object.assign({},{
              "message":"addParameter",
              "handlerQueueId":handlerQueueId,
              "objectPath":activeComponent+markup.objectPath,
              "parameter":{
                "name":"text",
                "type":"velocity",
                "isFinal":"yes",
                "defaultValue":markup.text
               },
              "fullDestObjectPath":activeComponent+markup.objectPath,
              "destObjectPath":activeComponent+markup.objectPath,
              "preceedingParam":null
            });  
            vm.broadcastEvent(vm.addObjectParameterEvent);
       }
       else
       {//both Markup{} and markup need to be created
              var markupObjectName = "Markup"+(new Date().getTime())+"{}";
              var eventQueue = [];
              eventQueue.push(Object.assign({},{
                "message":"addParameter",
                "objectPath":activeComponent+"/"+markupObjectName,
                "parameter":{
                  "name":"text",
                  "type":"velocity",
                  "isFinal":"yes",
                  "defaultValue":vm.configurationMarkupText
                },
                "fullDestObjectPath":activeComponent+"/"+markupObjectName,
                "destObjectPath":activeComponent+"/"+markupObjectName,
                "preceedingParam":null
              }));  
              vm.configurationMarkupText = null;
              vm.addObjectParameterEvent = Object.assign({},{
                "message":"addParameter",
                "handlerQueueId":handlerQueueId,
                "schemaPath":vm.joinSchemaPath(component.schemaPath,"#/properties/Markup"),
                "objectPath":activeComponent,
                "parameter":{
                      "name":markupObjectName.substring(0,markupObjectName.indexOf("{}")),
                      "type":"crud",
                      "defaultValue":markupObjectName,
                      "isFinal":"yes",
                      "evalRight":"yes"
                },
                "fullDestObjectPath":activeComponent+"/"+markupObjectName,
                "destObjectPath":activeComponent,
                "preceedingParam":null,
                "eventQueue":eventQueue
              });  
              vm.broadcastEvent(vm.addObjectParameterEvent);          
         }
    }
    onAddSchemaProp(schemaProp){
        var vm = this;
        var activeComponent = vm.getClientAppData("activeConfigComponent");

        vm.addObjectParameterEvent = Object.assign({},{
          "message":"addParameter",
          "parameter":{
            "name":schemaProp.name,
            "type":"crud",
            "defaultValue":schemaProp.name+"{}",
            "isFinal":"yes",
            "evalRight":"yes"
          },
          "schemaPath":schemaProp.schemaPath,
          "objectPath":activeComponent,
          "fullDestObjectPath":activeComponent+"/"+schemaProp.name+"{}",
          "destObjectPath":activeComponent
        });

        if(schemaProp.addEvent)
            vm.addObjectParameterEvent = schemaProp.addEvent;   

        if(schemaProp.dependency)
        {

            vm.addObjectParameterEvent = Object.assign(vm.addObjectParameterEvent,{
              "dependency":schemaProp.dependency
            });      
        }

        var markupTag = schemaProp.schema?schemaProp.schema.schemaExtension.settings.markupTag:null;
        vm.setClientAppData("parameterName",markupTag && vm.getClientAppData("dndRules").containers[markupTag]?vm.getClientAppData("dndRules").containers[markupTag].label:schemaProp.name);
        vm.setClientAppData("parameterName",vm.getClientAppData("parameterName")+(new Date().getTime()));

        //vm.componentLabelAction = "Add";
        //vm.bShowLabelDialog = true;
        vm.addUIComponent();
    }
    onShowSchema(activeComponent,schemaPath){
        var vm = this;
        vm.setClientAppData("activeConfigComponent",activeComponent);
        var component = this.getClientAppData().composerDOM[activeComponent];


        component.schemaProps = [];
        vm.setClientAppData("activeComponentSchemaProps",[]);
        var handlerQueueId = new Date().getTime();
        var resolver = {"resolve":function(event){
            var schema = event.data.response;

            if(event.data.responseTo.isContent)
            {
                var addObjectParameterEvent = Object.assign({},{
                  "message":"addParameter",
                  "handlerQueueId":new Date().getTime(),
                  "schemaPath":vm.joinSchemaPath(component.schemaPath,"#/properties/Contains"),
                  "objectPath":activeComponent,
                  "parameter":{
                        "name":"Contains",
                        "type":"crud",
                        "defaultValue":"Contains{}",
                        "isFinal":"yes",
                        "evalRight":"yes"
                  },
                  "fullDestObjectPath":activeComponent+"/Contains{}",
                  "destObjectPath":activeComponent,
                  "preceedingParam":null,
                  "autoProcessEventQueue":true,
                  "eventQueue":[]
                });

                for(var prop in schema.properties)
                {
                   if(!prop.startsWith("solvent_") && !prop.startsWith("$"))
                   {

                      var addEvent = Object.assign({},{
                        "message":"addParameter",
                        "handlerQueueId":new Date().getTime(),
                        "schemaPath":vm.joinSchemaPath(component.schemaPath,"#/properties/Contains/properties/"+prop),
                        "objectPath":activeComponent+"/Contains{}",
                        "parameter":{
                              "name":prop,
                              "type":"crud",
                              "defaultValue":prop+"{}",
                              "isFinal":"yes",
                              "evalRight":"yes"
                        },
                        "fullDestObjectPath":activeComponent+"/Contains{}/"+prop+"{}",
                        "destObjectPath":activeComponent+"/Contains{}",
                        "preceedingParam":null,
                        "autoProcessEventQueue":true,
                        "eventQueue":[]
                      });                 
                      component
                      .schemaProps
                      .push({
                        "schema":schema.properties[prop],
                        "name":prop,
                        "schemaPath":vm.joinSchemaPath(component.schemaPath,"#/properties/Contains/properties/"+prop),
                        "addEvent":addEvent,
                        "dependency":addObjectParameterEvent
                      });
                   }
                }          
            }
            else
            {
                for(var prop in schema.properties)
                {
                   if(!prop.startsWith("solvent_") && !prop.startsWith("$"))
                   {
                      if(prop != "Settings" && 
                         prop != "Markup" && 
                         prop != "Events" && 
                         prop != "Directives" && 
                         prop != "Data Model" &&
                         prop != "Contains")
                      component.schemaProps.push({
                        "schema":schema.properties[prop],
                        "name":prop,
                        "schemaPath":vm.joinSchemaPath(event.data.responseTo.schemaPath,"#/properties/"+prop)
                    });
                   }
                }
            }

            if(false && schema.properties["Contains"])//fetch any slot definitions 
            {
                handlerQueueId = new Date().getTime();
                vm.eventHandlerQueue[handlerQueueId] = resolver;
                //get slot schema
                var callSchemaEvent = Object.assign({},{
                  "message":"callSchema",
                  "isContent":true,
                  "handlerQueueId":handlerQueueId,
                  "schemaPath":vm.joinSchemaPath(component.xsolvent_object_schema,"#/properties/Contains"),
                  "objectPath":activeComponent
                });
                vm.broadcastEvent(callSchemaEvent);           
            }
            else
            {
               vm.setClientAppData("activeComponentSchemaProps",component.schemaProps);
            }
        }};
        vm.eventHandlerQueue[handlerQueueId] = resolver;
        //get component schema
        var callSchemaEvent = Object.assign({},{
          "message":"callSchema",
          "handlerQueueId":handlerQueueId,
          "schemaPath":schemaPath?vm.joinSchemaPath(component.xsolvent_object_schema,schemaPath):component.xsolvent_object_schema,
          "objectPath":activeComponent
        });
        vm.broadcastEvent(callSchemaEvent);   
    }
}


class LowcodrReactJS extends Lowcodr{
    constructor(app){
      	super(app);
      
        this.radkitServer=this.radkitServer.bind(this);
        this.getClientAppData=this.getClientAppData.bind(this);
        this.setClientAppData=this.setClientAppData.bind(this);
      	this.domRefs=this.domRefs.bind(this); 
    }  

  	getClientAppData(key){      
        return key?this.clientApp.state[key]:this.clientApp.state; 
    }  
  	setClientAppData(key,val){
        this.clientApp.setState(key,val); 
    }  
    domRefs(){  
      return this.DOMrefs;             
    }   
  	////////////////////////////////////////////////////////////////////////////////////
  	//Interface API between browser and backend code for RADKit. This includes
  	//triggering render and non-render operation and updating UI.
  	////////////////////////////////////////////////////////////////////////////////////
    radkitServer(objectFramePath,objectFrameNodePath,reqParam){
      var vm = this;
      var dfd = new $.Deferred();
      var renderedNode = vm.findRenderedNode(objectFrameNodePath);

      var compilerEndPoint = objectFramePath.substring(0,objectFramePath.indexOf("{}")+2).replace("//","/");
      var param = {
        "solvent_radkit_composer_on":vm.getBrowserParam("solvent_radkit_composer_on"),
        "solvent_radkit_composer_action":"compile-node",
        "solvent_radkit_composer_nodepath":renderedNode.path,
        "solvent_radkit_composer_requested_resource":renderedNode.path
      };
      if(reqParam)
      {	
        param = Object.assign(param,reqParam);
      }   
      vm.setClientAppData("progressOverlay",true);
      $.ajax({
        method: "POST",
        url: compilerEndPoint,
        data:param,
        dataType:"json"
      })
        .done(function( node ) {
        vm.setClientAppData("progressOverlay",false);
        //var nodeDescription = node[node.solvent_radkit_composer_node_path];
        //vm.composerDOM[node.solvent_radkit_composer_node_path] = nodeDescription;

        var recompileData = vm.getObjectByType(node,"InstanceDataModel{}");
        if(recompileData)
        {
          var DnDcontainers =  Object.assign({},recompileData.DnDcontainers);
          var composerDOM =  Object.assign({},recompileData.composerDOM);
          var composerDOMPaths =  Object.assign({},recompileData.composerDOMPaths);

          //console.log("vm.getClientAppData("DnDcontainers")")
          //console.log(JSON.stringify(vm.getClientAppData("DnDcontainers")));
          vm.setClientAppData("DnDcontainers",DnDcontainers);
          vm.setClientAppData("composerDOM",composerDOM);
          vm.setClientAppData("composerDOMPaths",composerDOMPaths);

          vm.mergeObjects(vm.state,recompileData);
        }

        var nodeDescription = vm.getClientAppData("composerDOM")[node.solvent_radkit_composer_node_path];
        vm.setNodeDescriptions(node);

        //console.log("Render function before calling compile");
        //console.log(vm.render);

        var nodeYield = vm.getNodeYield(node);


        if(nodeYield.startsWith("<SolventRadkitComposerNodeFrame"))
        {
          nodeYield = vm.stripLeadingTag(nodeYield);
          nodeYield = nodeYield.substring(0,nodeYield.lastIndexOf("</SolventRadkitComposerNodeFrame>"));
        }
        else
          if(nodeYield.startsWith("<template"))//climb up until a non-template node
          {
            var parentNodePath = renderedNode.path.substring(0,renderedNode.path.lastIndexOf("/"));
            vm.radkitServer(objectFramePath,parentNodePath,reqParam)
              .then(function(node){
              dfd.resolve(node);
            });
            return;
          }     

        //strip out inner frame wrapping
        //nodeYield = nodeYield.substring(node.xsolvent_radkit_composer_uicomponent_frame_yield.length);
        //nodeYield = nodeYield.substring(0,nodeYield.lastIndexOf("</SolventRadkitComposerNodeFrame>"));


        nodeDescription.xsolvent_radkit_composer_uicomponent_slot = nodeYield;

        /**
                      var jsxCode = Babel.
                      transform("nodeDescription.xsolvent_radkit_composer_uicomponent_slot= ()=> ("+nodeYield+")", {                  
                        //"plugins": ["@babel/plugin-transform-react-jsx"],
                        "presets": ["react"]
                      }).code;
                      //eval(jsxCode);
                      console.log(nodeDescription.xsolvent_radkit_composer_uicomponent_slot);
                      **/
        console.log("radkitServer:Triggering Render Function");
        //trigger render
        //nodeDescription.xsolvent_radkit_composer_uicomponent_initialized = true;

        //nodeDescription.xsolvent_radkit_composer_uicomponent_refId = new Date().getTime();
        if(nodeDescription.forceUpdate)
          nodeDescription.forceUpdate();

        //vm.setState({"composerDOM"})

        dfd.resolve(node);
      });        
      return dfd.promise();
    }
}


class LowcodrVueJS extends Lowcodr{
    constructor(app){
        super(app);
        this.radkitServer=this.radkitServer.bind(this);
        this.getClientAppData=this.getClientAppData.bind(this);
        this.setClientAppData=this.setClientAppData.bind(this);
        
      	this.domRefs=this.domRefs.bind(this);  
    }  
  
  	getClientAppData(key){
      	//console.log("getClientAppData:"+key);
      	//console.log(this.clientApp.$data)
        return key?this.clientApp.$data[key]:this.clientApp.$data;
    }  
  	setClientAppData(key,val){
       
       var vueObject = this.getClientAppData(key);
       this.getClientAppData()[key] = val;
       if(typeof val == "object" && vueObject != null && typeof vueObject == "object")
       {
           for(var vk in val)
           {
              Vue.set(vueObject,vk,val[vk]);
           }
       }
    }  
  
  	domRefs(){
      return this.clientApp.$refs;           
    }   
  	////////////////////////////////////////////////////////////////////////////////////
  	//Interface API between browser and backend code for RADKit. This includes
  	//triggering render and non-render operation and updating UI.
  	////////////////////////////////////////////////////////////////////////////////////  
    radkitServer(objectFramePath,objectFrameNodePath,reqParam){
       var vm = this;
       var dfd = new $.Deferred();
       //var component = vm.getClientAppData().composerDOM[objectFrameNodePath];
       var renderedNode = vm.findRenderedNode(objectFrameNodePath);

       var compilerEndPoint = objectFramePath.substring(0,objectFramePath.indexOf("{}")+2).replace("//","/");
       var param = {
           "solvent_radkit_composer_on":vm.getBrowserParam("solvent_radkit_composer_on"),
           "solvent_radkit_composer_action":"compile-node",
           "solvent_radkit_composer_nodepath":renderedNode.path,
           "solvent_radkit_composer_requested_resource":renderedNode.path
       };
       if(reqParam)
       {	
            param = Object.assign(param,reqParam);
       }

       vm.setClientAppData("progressOverlay",true);
       $.ajax({
                method: "POST",
                url: compilerEndPoint,
                data:param,
                dataType:"json"
                })
                .done(function( node ) {
                    vm.setClientAppData("progressOverlay",false);
                    //var nodeDescription = node[node.solvent_radkit_composer_node_path];
                    //vm.getClientAppData().composerDOM[node.solvent_radkit_composer_node_path] = nodeDescription;

                    var recompileData = vm.getObjectByType(node,"InstanceDataModel{}");
                    if(recompileData)
                    {
                       var DnDcontainers =  recompileData.DnDcontainers;
                       var DnDcomponentTree =  recompileData.composerDOM;
                       var DnDcomponentTreePaths =  recompileData.composerDOMPaths;

                       //console.log("vm.getClientAppData("DnDcontainers")")
                       //console.log(JSON.stringify(vm.getClientAppData("DnDcontainers")));

                       //vm.getClientAppData("DnDcontainers") = Object.assign(vm.getClientAppData("DnDcontainers"),DnDcontainers);
                       //vm.getClientAppData().composerDOM = Object.assign(vm.getClientAppData().composerDOM,DnDcomponentTree);
                       vm.setClientAppData("DnDcontainers",DnDcontainers); 
                       vm.setClientAppData("composerDOM",DnDcomponentTree);
                       vm.setClientAppData("composerDOMPaths",DnDcomponentTreePaths);

                       vm.mergeObjects(vm.getClientAppData(),recompileData);
                    }

                    var nodeDescription = vm.getClientAppData().composerDOM[node.solvent_radkit_composer_node_path];
                    vm.setNodeDescriptions(node);

                    //console.log("Render function before calling compile");
                    //console.log(vm.render);

                    var nodeYield = vm.getNodeYield(node);
                    //strip out inner frame wrapping
                    //nodeYield = nodeYield.substring(node.xsolvent_radkit_composer_uicomponent_frame_yield.length);

                    if(nodeYield.startsWith("<solvent-radkit-composer-node-frame"))
                    {
                        nodeYield = vm.stripLeadingTag(nodeYield);
                        nodeYield = nodeYield.substring(0,nodeYield.lastIndexOf("</solvent-radkit-composer-node-frame>"));
                    }
                    else
                    if(nodeYield.startsWith("<template"))//climb up until a non-template node
                    {
                        var parentNodePath = renderedNode.path.substring(0,renderedNode.path.lastIndexOf("/"));
                        vm.radkitServer(objectFramePath,parentNodePath,reqParam)
                          .then(function(node){
                          dfd.resolve(node);
                        });
                        return;
                    }

                    var renderFN = Vue.compile(nodeYield);
                    var staticRenderFns =  vm.clientApp.$options.staticRenderFns;
                    var render = vm.clientApp.render;
                    var _staticTrees = vm.clientApp._staticTrees;

                    vm.clientApp._staticTrees = [];
                    vm.clientApp.$options.staticRenderFns = [];
                    renderFN.staticRenderFns.map(fn => (vm.clientApp.$options.staticRenderFns.push(fn)));

                    nodeDescription.xsolvent_radkit_composer_uicomponent_slot = renderFN.render.call(vm.clientApp);

                    vm.clientApp.$options.staticRenderFns = [];
                    staticRenderFns.map(fn => (vm.clientApp.$options.staticRenderFns.push(fn)));
                    vm.clientApp._staticTrees = _staticTrees;//so WRONG
         
                    console.log("radkitServer:Triggering Render Function");
                    //trigger render
                    //nodeDescription.xsolvent_radkit_composer_uicomponent_initialized = true;
                    nodeDescription.xsolvent_radkit_composer_uicomponent_refId = new Date().getTime();
                    dfd.resolve(node);
        });        
        return dfd.promise();
     }
}  
