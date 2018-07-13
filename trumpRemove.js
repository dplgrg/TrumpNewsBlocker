var keyList;

chrome.storage.sync.get("keyItem",function(results){
	keyList=results;
	
	if(keyList["keyItem"]==null){
		keyList={
			"keyItem":[]
			
		};
		
		saveKeyList();
	}
	
});

function saveKeyList(){
	chrome.storage.sync.set(
	{
		'keyItem':keyList['keyItem']
	},function(result){
		
		if(chrome.runtime.error){
			console.log(chrome.runtime.error);
		}
	}
	);
	
}

$(function(){
	keyList['keyItem']=['Trump','trump','Melania','melania','POTUS','potus'];
	
	updateListView();
	searchForTrump();
	
	
	function updateListView(){
		if(keyList['keyItem']!=null){
			$('#listView').empty();
			var html='<ul>';
			
			for(var i=0;i<keyList['keyItem'].length;i++){
				html+='<li>'+keyList['keyItem'][i]+'</li>';
			}
			html+='</ul>';
			$('#listView').append(html);
			
		}
	}
	
	function searchForTrump(){
		if(keyList['keyItem']!=null){
			var searchString='';
			
			for(var i=0;i<keyList['keyItem'].length;i++){
				searchString+='p:contains("'+keyList['keyItem'][i]+'"), ';
				searchString+='div:contains("'+keyList['keyItem'][i]+'"), ';
				searchString+='span:contains("'+keyList['keyItem'][i]+'"), ';
			}
			searchString=searchString.substring(0,searchString.length-2);
			
			$(searchString).parents('.userContentWrapper').css('display','none');
		}
	}
	
	
	$('#submit-button').click(function(event){
		var item=$('#block-item').val().toLowerCase();
		keyList['keyItem'].push(item);
		saveKeyList();
		
		$('#block-item').val('');
		updateListView();
		searchForTrump();
		
		
	});
	
	$('#clear-button').click(function(event){
		keyList['keyItem']=[];
		saveKeyList();
		
		$('#block-item').val('');
		updateListView();
		searchForTrump();
		
	});
	
	
	var observer=new MutationObserver(function(mutations,observer){
		searchForTrump();
	});
	
	observer.observe($('[id^=topnews_main_stream_]').get(0),{
		attributes: true,
		  childList: true,
		  subtree: true,
		  characterData: true
			});
});
