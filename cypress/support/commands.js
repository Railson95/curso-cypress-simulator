Cypress.Commands.add("login", (skipCaptcha) => {
  const setup = () => {
    cy.visit(`./src/index.html?skipCaptcha=${skipCaptcha}`);
    cy.contains("button", "Login").click();
  };

  const validate = () => {
    cy.visit("./src/index.html");
    cy.contains("button", "Login", { timeout: 1000 }).should("not.be.visible");
  };

  const options = {
    cacheAcrossSpecs: true,
    validate,
  };

  cy.session("sessionId", setup, options);
});

Cypress.Commands.add("run", (cmd) => {
  cy.get("#codeInput").type(cmd);
  cy.contains("button", "Run").click();
});
