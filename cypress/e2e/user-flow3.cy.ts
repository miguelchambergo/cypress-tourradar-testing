describe('user flows', () => {
    it('user flow 3', () => {
      cy.viewport("macbook-16")
      const test_email = "test2@mail.com"
      const base_URL = "https://www.tourradar.com"
      const URL = base_URL + "/d/europe"
      const duration = ["duration=1-3","Duration is 1 - 3 days"]
      const budget = ["budget=0-1300","Budget is €0 - 1,300"]
      const location = ["countries=66","Goes through Germany"]
      const group_size = ["group_sizes=more_than_50","Group Size is 50+ people","group_sizes"]
      const adventure_type = ["group_type=372","Adventure Type is Group"]
      const age = ["suitable=30+","Suitable for \n                      30 +\n                    "]

      const longURL = `${URL}#${duration[0]},${budget[0]},${location[0]},${group_size[0]},${adventure_type[0]},${age[0]}`
  
      //1. Visitis URL with filters
      cy.visit(longURL)

      //Negative case: Sets language to "Nederlands"
      //Expected result: filters remain
      //Actual result: filters get cleared
      /*
      cy.get('.ao-header-navigation__language').trigger("mouseover").then(() => {
        //cy.get('ao-header-navigation__dropdown-link').find("a").contains("Nederlands")
        cy.get('.ao-header-navigation__dropdown-list--language-active').should("be.visible").then(() => {
          cy.get('.ao-header-navigation__dropdown-list--language-active > :nth-child(3) > .ao-header-navigation__dropdown-link').click()
          //cy.get('.ao-header-navigation__language > .js-ao-header-navigation__dropdown-toggle > .ao-header-navigation__dropdown > .ao-header-navigation__dropdown-title')
        })
      })
      */

      var numberOfFilters = 0
      cy.get('.js-serp-parameters__filters').children().each(($element,index,$list) => {
        if(index==0){cy.wrap($element).should("contain",duration[1])}
        if(index==1){cy.wrap($element).should("contain",budget[1])}
        if(index==2){cy.wrap($element).should("contain",location[1])}
        if(index==3){cy.wrap($element).should("contain",group_size[1])}
        if(index==4){cy.wrap($element).should("contain",adventure_type[1])}
        if(index==5){cy.wrap($element).should("contain",age[1])}
      })

        cy.get('[data-cy="serp-filters--filter-card-number-of-filters-applied"]').should("contain",6)

      //2. Disables 1 filter
      cy.get(`div[data-clear="${group_size[2]}"] > .serp-parameters__filters-filter-clear`).click()
      cy.get('[data-cy="serp-filters--filter-card-number-of-filters-applied"]').should("contain",5  )

      //Optional: Wait for the cookies pop-up to appear and accept all cookies
      cy.get('.aa-btn--primary.cn-button__desktop', { timeout: 10000 }).should('be.visible').click();

      //3. Selects one tour from the list view
      cy.get(`[data-cy="serp-tour"]`).as("listViewMockups").should('have.length.greaterThan', 0)
      cy.get("@listViewMockups").each(($element, index, $list) =>{
        //Selecting the very first item
        if (index == 0) {
            cy.wrap($element).children(".bl ")
            .children("a").should("have.attr","href").then((href) => {
            //Forcing the link to be opened within the same window, as Cypress cannot work with tabs
            cy.visit(base_URL + `${href}`)
          })
        }
      })

      //Optional: Close the welcome pop-up window
      cy.get('.ao-common-social-login-popup__close',{ timeout: 10000 }).should('be.visible').click()
      
      //4. Selects a few levels up the hierachy using the breadcrumps
      cy.get('.tour-breadcrumbs > ul').children().eq(2).click()
      cy.get('.ao-clp-title-with-search__cta > .aa-btn').should("be.visible").contains("Search").click()
      
      //5. Downloads the brochure from the list view
      cy.get(`[data-cy="serp-tour"]`).as("listViewMockups2").should('have.length.greaterThan', 0)
      cy.get("@listViewMockups2").each(($element, index, $list) =>{
        //Selecting the very first item
        if (index == 0) {
            cy.wrap($element).children(".br ").children(".br__button-wrapper")
            .children(`[data-cy="serp-tour--download-brochure"]`)
            .click()
        }
      })
      cy.get('[data-cy="common-download-brochure--email-input"]').type(`${test_email}`)
      cy.get('[data-cy="common-download-brochure--submit"]').click()
      cy.get('#callback_popup > .js-scout-component__modal-dialog > .scout-component__modal-top > .scout-component__modal-heading')
      .should("contain","Brochure successfully sent!")
      //TO DO: Verify the name of the brochure
      cy.get('.brochure-modal__wrap > .brochure-modal__text').should("contain",test_email)

      //6. Rates TourRader with '10' if asked about it
      cy.elementExists('[data-score="10"]').then((rateScore) => {
        if(rateScore){
          cy.get('[data-score="10"]').click()
          cy.get('.aa-textarea').type("I just like it").then(() => {
            cy.get('.js-ao-common-nps__feedback > .aa-btn').click()
          })
        }
      })
      
    })
  })