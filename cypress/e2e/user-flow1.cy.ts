describe('user flows', () => {
  it('user flow 1', () => {
    cy.viewport(1440,900)
    const test_email = "test@mail.com"
    const base_URL = "https://www.tourradar.com"
    const URL = base_URL + "/d/europe"
    cy.visit(URL)

    //1. Selects Adventure Type: Explorer
    //TO DO: change this to be done via top menu filter:
    cy.get('[data-pid="383"] > .ao-serp-filters-checkbox__label').click()
    cy.url().should("contain","sub_types=383")

    //Optional: Wait for the cookies pop-up to appear and accept all cookies
    cy.get('.aa-btn--primary.cn-button__desktop', { timeout: 10000 }).should('be.visible').click();

    //2. Selects Trip Lengh: 5 - 15 days
    const topValue = 15
    const lowValue = 5
    const rangeText = lowValue + "-" + topValue
    cy.get('[data-cy="serp-filters--duration-upper-sliderpoint"] > .noUi-touch-area').setLengthSliderTopValue(topValue)
    cy.get('[data-cy="serp-filters--duration-lower-sliderpoint"] > .noUi-touch-area').setLengthSliderLowValue(lowValue)
    cy.url().should("contain",`duration=${rangeText}`)

    //3. Selects Trip Date: March, 2023 & April, 2023
    cy.get('[data-pid="march-2023"] > .ao-serp-filters-checkbox__link > .ao-serp-filters-checkbox__label').click()
    cy.get('[data-pid="april-2023"] > .ao-serp-filters-checkbox__link > .ao-serp-filters-checkbox__label').click()
    cy.url().should("contain","month=march-2023:april-2023")

    //4. Selects countries: Czech Republic & Germany
    //Clicks on "Show more"
    cy.get(`[data-select-label="Goes through {{listOfCountries}}"] > .c > .ao-serp-filters-show-more__wrapper > [type="button"]`).click()
    cy.get('.inside > :nth-child(8) > .ao-serp-filters-checkbox__label').click()
    cy.get('.mfp-close').click()
    //Selects "Germany"
    cy.get('[data-pid="66"] > .span > .ao-serp-filters-checkbox__label').click()
    cy.url().should("contain","countries=66:47")

    //5. Selects Price Range: $0 - $9500
    cy.get('[data-cy="serp-filters--budget-per-person-upper-sliderpoint"] > .noUi-touch-area').setPriceSliderTopValue(9500)
    cy.url().should("contain","budget=0-9500")

    //6. Loads more results in the list view
    cy.get('[data-cy="serp-tours--list"] > .blue').click()
      cy.log("Button clicked")
      //Warning: this can potentially time out if the backend is slow
      cy.get(`[data-cy="serp-tour"]`).as("listViewMockups").should('have.length', 30)
      cy.get("@listViewMockups").each(($element, index, $list) =>{
        //Selecting item 16 on purpose, as it falls on the second page
        if (index == 16) {
          cy.wrap($element).children(".br ").children(".br__button-wrapper")
          .children("a").should("have.attr","href").then((href) => {
            //Forcing the link to be opened within the same window, as Cypress cannot work with tabs
            cy.visit(base_URL + `${href}`)
          })
        }
      })
      
      //7. Downloads brochure
      cy.get('[data-cy="tdp-tour-planning--brochure-download"]').click()
      cy.get('[data-cy="common-download-brochure--email-input"]').type(`${test_email}`)
      cy.get('[data-cy="common-download-brochure--submit"]').click()
      cy.get('#callback_popup > .js-scout-component__modal-dialog > .scout-component__modal-top > .scout-component__modal-heading')
      .should("contain","Brochure successfully sent!")
      //TO DO: Verify the name of the brochure
      cy.get('.brochure-modal__wrap > .brochure-modal__text').should("contain",test_email)
    
  })
})