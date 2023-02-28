 Cypress.Commands.add('setLengthSliderTopValue', { prevSubject: 'element'}, (subject, topValue) => { 
    var topValueString = ""
    if(topValue > 21 || topValue < 1){
        cy.log("The top value must be between 1 and 21")
    }
    else {
        for(let j = 21; j > topValue; j--){
            topValueString += "{leftArrow}"
        }   
    }
    cy.wrap(subject).trigger('mousedown')
    .type(topValueString) 
})

Cypress.Commands.add('setLengthSliderLowValue', { prevSubject: 'element'}, (subject, lowValue) => { 
    var lowValueString = ""
    if(lowValue < 0 || lowValue > 19){
        cy.log("The low value must be between 0 and 20")
    }
    else {
        for(let i = 1; i < lowValue; i++){
            lowValueString += "{rightArrow}"
        }  
    }
    cy.wrap(subject).trigger('mousedown')
    .type(lowValueString) 
})

Cypress.Commands.add('setPriceSliderTopValue', { prevSubject: 'element'}, (subject, topValue) => { 
    var topValueString = ""
    if(topValue > 10000 || topValue < 1){
        cy.log("The top value must be between 1 and 21")
    }
    else {
        for(let j = 10000; j > topValue; j-=100){
            topValueString += "{leftArrow}"
        }   
    }
    cy.wrap(subject).trigger('mousedown')
    .type(topValueString) 
})

Cypress.Commands.add('setPriceSliderLowValue', { prevSubject: 'element'}, (subject, lowValue) => { 
    var lowValueString = ""
    if(lowValue < 0 || lowValue > 9999){
        cy.log("The low value must be between 0 and 20")
    }
    else {
        for(let i = 1; i < lowValue; i+=100){
            lowValueString += "{rightArrow}"
        }  
    }
    cy.wrap(subject).trigger('mousedown')
    .type(lowValueString) 
})

Cypress.Commands.add('elementExists', (selector) => {
    return cy.window().then($window => $window.document.querySelector(selector));
  });

Cypress.Commands.add('findAvailableDate', (() => {
    var currentDayNumber = 27
    var dataDay = `[data-day="` + currentDayNumber + `"]`
    cy.get(dataDay).should("be.visible").trigger("mouseover").trigger("mousedown").then(() => {
        cy.get('.js-pika-single-mobile__panel-cta').should("be.visible").contains("Apply").click()
        cy.get('.scout-component-date-traveller-select__traveller-popup-panel-cta').click()
    })

}))

Cypress.Commands.add('fillAskQuestionForm', () => {
    var name = "Sandra Königsberg"
    var email = "test@mail.com"
    var question = "Can I take my dog with me. He is lovely and well-behaved"

    cy.get('[data-cy="tdp-ask-question--traveller-name-input"]').type(name)
    cy.get('[data-cy="tdp-ask-question--traveller-email-input"]').type(email)
    cy.get('[data-cy="tdp-ask-question--message-textarea"]').type(question)

    cy.get('[data-cy="tdp-ask-question--submit"]').contains("Send Question").click()
    cy.get('#ask_popup_success > .js-scout-component__modal-dialog > .scout-component__modal-top > .scout-component__modal-heading')
    .should("be.visible").contains("Question Sent!")

  });
