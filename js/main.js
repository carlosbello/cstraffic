ko.bindingHandlers.jqCheckboxRadio = {
    init: function(element, valueAccessor) {
        var currentValue = valueAccessor();
        $("input[type='radio']", element).on("checkboxradiocreate",
            function( event, ui ) {$(element).data( "init", true )} );
        $("input[type='radio']", element).checkboxradio();
    },
    update: function(element, allBindingsAccessor) {
        var currValue = allBindingsAccessor().signal.nombre;
        var initialized = $(element).data("init");
        if(initialized){
        	console.log('Data initialized');
            $("input[type='radio']",element).prop( "checked", false )
                .checkboxradio( "refresh" );
            $("input[type='radio'][value='"+currValue+"']",element)
                .prop( "checked", true ).checkboxradio( "refresh" );
        }
    }
};

function StudyViewModel() {
	var self = this;
	
	var categories = [db.signals.danger, db.signals.reglament, db.signals.orientation];
	
	self.dangerSignals = ko.observableArray(db.signals.danger);
	self.reglamentSignals = ko.observableArray(db.signals.reglament);
	self.orientationSignals = ko.observableArray(db.signals.orientation);	
	self.currentQuestion = ko.observable();
	self.answerOK = ko.observable(0);
	self.answerKO = ko.observable(0);
	self.percentOK = ko.computed(function () {
		return self.answerOK() > 0 
			? (self.answerOK()/(self.answerOK() + self.answerKO()) * 100).toFixed(2)
			: 0;
	});
	self.currentAnswerIsOK = ko.observable(false);
	self.currentAnswerIsKO = ko.observable(false);
	
	function getRandomCategory() {
		return categories[Math.floor(Math.random() * categories.length)];		
	}	
	
	function getRandomSignal(category) {
		return category[Math.floor(Math.random() * category.length)]
	}
	
	self.generateRandomQuestion = function () {
		var randomCategory = getRandomCategory(); 
		var randomSignal = getRandomSignal(randomCategory);
		var question = {
				signal: randomSignal,
				names: [getRandomSignal(randomCategory).nombre, 
				        getRandomSignal(randomCategory).nombre, 
				        getRandomSignal(randomCategory).nombre]
		};
		question.names[Math.floor(Math.random() * question.names.length)] = randomSignal.nombre;
		self.currentQuestion(question);
		self.currentAnswerIsOK(false);
		self.currentAnswerIsKO(false);
	}
	
	self.checkAnswer = function () {
		var answer = $("input[type='radio'][name='answer']:checked").attr('data-value');
		if (! answer) return; 
		if (answer == self.currentQuestion().signal.nombre) {
			self.answerOK(self.answerOK() + 1);
			self.currentAnswerIsOK(true);
			self.currentAnswerIsKO(false);
		} else {
			self.answerKO(self.answerKO() + 1);
			self.currentAnswerIsOK(false);
			self.currentAnswerIsKO(true);
		}
	}

	self.goNextRandomQuestion = function () {
		self.checkAnswer();
		if (self.currentAnswerIsOK())
			self.generateRandomQuestion();
	}
	
	self.generateRandomQuestion();
}

//Initialize function
var init = function () {
    // TODO:: Do your initialization job
    console.log("init() called");

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
            tizen.application.getCurrentApplication().exit();
    });
    
    window.studyViewModel = new StudyViewModel();
	ko.applyBindings(studyViewModel);
	
	setTimeout(function () {
			$.mobile.changePage("#home", {transition: 'slide'});
	}, 3000);
};
$(document).ready(init);
