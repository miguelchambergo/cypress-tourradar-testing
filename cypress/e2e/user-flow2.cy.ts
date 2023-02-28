describe('user flows', () => {
    it('user flow 2', () => {
      cy.viewport(414,896)
      const test_email = "test@mail.com"
      const base_URL = "https://www.tourradar.com"
      const URL = base_URL + "/d/europe"
      cy.visit(URL)
  
      //1. Selects Location: Australia
      //TO DO: change this to be done via top menu filter:
      cy.get('[data-cy="common-header--menu-mobile"]').click()
      cy.get('.ao-header-navigation-mobile__menu-list > :nth-child(2) > .js-ao-header-navigation-mobile__menu-link').click()
      cy.get(':nth-child(3) > .js-ao-header-navigation-mobile__submenu-category-link').click()
      cy.get(':nth-child(3) > .js-ao-header-navigation-mobile__submenu-list > .ao-header-navigation-mobile__submenu-scrollable-list > :nth-child(1) > .js-header-destination__link').click()
      cy.url().should("contain","d/australia")
  
      //2. Selects a trip with a discount
      cy.get('.ao-clp-specials-and-news__wrapper').children().contains("Low Season").click()
      cy.url().should("contain","month=")
      cy.get(`[data-cy="serp-tour"] > .bm`).as("mobileListViewMockups")
      cy.get("@mobileListViewMockups").each(($element, index, $list) =>{
        //Selecting item 2 on purpose, as it has a discount
        if (index == 2) {
            cy.wrap($element).children(".tourLink").should("have.attr","href").then((href) => {
            //TO DO: make it open in the same window
            cy.visit(base_URL + `${href}`)
          })
        }
      })

      //TO DO: Look for an iteam with a discount

      //3. Scrolls down to see the reviews and sorts them by popularity
      //TO DO: scroll down
      cy.get('.ao-tour-reviews > .ao-tour-block__heading').scrollIntoView()
      //Optional: Wait for the cookies pop-up to appear and accept all cookies
      cy.get('.aa-btn--primary.cn-button__mobile', { timeout: 10000 }).should('be.visible').click()
      cy.get(':nth-child(2) > .ao-tour-reviews__sorting-item').click()
      //Optional: Close the welcome pop-up window
      cy.get('.ao-common-social-login-popup__close',{ timeout: 10000 }).should('be.visible').click()
  
      //4. Verifies the availability and selects a date
      cy.get('button[data-cy="tdp-sticky-bar--check-availability"]').trigger('click')
      cy.get('[data-cy="tdp-availability"]')

      cy.elementExists('#js-datepicker').then((datePicker1) => {
        if(datePicker1){
            cy.get('#js-datepicker').click().then(() =>{
                cy.findAvailableDate()
            })
        }
      })
      cy.elementExists('[data-cy="tdp-availability--select-departure-month"]').then((datePicker2) => {
        if(datePicker2){
            cy.get('[data-cy="tdp-availability--select-departure-month"]').select(1)
        }
      })
  
      //5. Asks a question
      cy.get('[data-cy="tdp-ask-expert--ask-question"]').scrollIntoView().click()
      cy.fillAskQuestionForm()

        
        
      
  
  
      
      
    })
  })