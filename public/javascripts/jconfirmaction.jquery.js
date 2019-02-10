/*
 * jQuery Plugin : jConfirmAction
 * 
 * by Hidayat Sagita
 * http://www.webstuffshare.com
 * Licensed Under GPL version 2 license.
 *
 */
(function($){

	jQuery.fn.jConfirmAction = function (options) {
		
		// Some jConfirmAction options (limited to customize language) :
		// question : a text for your question.
		// yesAnswer : a text for Yes answer.
		// cancelAnswer : a text for Cancel/No answer.
		var theOptions = jQuery.extend ({
			question: "Are You Sure ?",
			yesAnswer: "Yes",
			cancelAnswer: "Cancel"
		}, options);
		
		return this.each (function () {
			
			$(this).bind('click', function(e) {
				e.preventDefault();
				thisHref	= $(this).attr('href');
				
				if($(this).next('.question').length <= 0)
					$(this).after('<div class="question">'+theOptions.question+'<br/> <span class="yes">'+theOptions.yesAnswer+'</span><span class="cancel">'+theOptions.cancelAnswer+'</span></div>');
				
				$(this).next('.question').animate({opacity: 1}, 300);
				
		//删除其数据库		
				
				
				
				$('.yes').bind('click', function(){
					
					$.ajax({
						type:"post",
						url:"/users/remove",
						data:{id:$(this).parent().parent().find(".dele").attr('data-id')},
						success:function(data){
							console.log(data)
							if(data==1){
								alert('删除成功');
								//location.reload()
								location.href=''
							}else{
								alert('删除失败');
								
							}
						}
					});
				});
				
		
				$('.cancel').bind('click', function(){
					$(this).parents('.question').fadeOut(300, function() {
						$(this).remove();
					});
				});
				
				
				
				
				
				
				
				
				
				
			});
			
		});
	}
	
})(jQuery);