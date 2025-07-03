describe.only("Cypress Simulator - A11y Checks", () => {
  beforeEach(() => {
    const skipCaptcha = true;
    cy.login(skipCaptcha);
    cy.visit(`./src/index.html?skipCaptcha=${skipCaptcha}`, {
      onBeforeLoad(win) {
        win.localStorage.setItem("cookieConsent", "accepted");
      },
    });
    cy.injectAxe();
  });

  it('Verificar a a11y ao inserir no "Cypress Code" um comando qualquer válido e verificar no "Cypress Output"', () => {
    const cmd = "cy.visit(url)";
    cy.run(cmd);
    cy.get("#outputArea", { timeout: 10000 })
      .should("be.visible")
      .and("contain", "Success");
    cy.checkA11y();
  });

  it('Verificar a a11y ao inserir no "Cypress Code" um comando qualquer inválido e verificar no "Cypress Output"', () => {
    const cmd = "cy.vi(url)";
    cy.run(cmd);
    cy.get("#outputArea", { timeout: 10000 })
      .should("be.visible")
      .and("contain", "Error");
    cy.checkA11y();
  });

  it('Verificar a a11y ao inserir "Cypress Code" o comando help e verificar os comandos no "Cypress Output" além do link oficial', () => {
    const cmd = "help";
    cy.run(cmd);
    cy.get("#outputArea", { timeout: 10000 })
      .should("be.visible")
      .and("contain", "Common Cypress commands and examples");

    cy.contains("#outputArea a", "official Cypress API documentation")
      .should(
        "have.attr",
        "href",
        "https://docs.cypress.io/api/table-of-contents"
      )
      .and("have.attr", "target", "_blank")
      .and("be.visible");
    cy.checkA11y();
  });

  it('Verificar a a11y quando selecionar o botão de Maximizar e Minimizar do "Cypress Output', () => {
    const cmd = "cy.visit(url)";
    cy.run(cmd);

    cy.get(".expand-collapse").click();

    cy.get("#outputArea", { timeout: 10000 })
      .should("be.visible")
      .and("contain", "Success");

    cy.checkA11y(); // ⬅️ verifica a acessibilidade após maximizar

    cy.get("#collapseIcon").should("be.visible");

    cy.get(".expand-collapse").click();

    cy.get("#expandIcon").should("be.visible");
  });
});

describe("Testes de captcha para o App Cypress Simulator - A11y Checks", () => {
  beforeEach("", () => {
    cy.visit("./src/index.html");
    cy.contains("button", "Login").click();
    cy.injectAxe();
  });

  it("Verificar a a11y antes e depois de inserir credênciais inválidas além do estatus do Botão", () => {
    cy.get("#captchaInput").should("have.value", "");
    cy.checkA11y();
    cy.get("#captchaInput").type(1000);

    cy.contains("button", "Verify").should("not.be.disabled");

    cy.contains("button", "Verify").click();
    cy.contains("#captchaError", "Incorrect answer, please try again").should(
      "be.visible"
    );

    cy.contains("button", "Verify").should("be.disabled");

    cy.get("#captchaInput").should("have.value", "");

    cy.checkA11y();
  });
});
