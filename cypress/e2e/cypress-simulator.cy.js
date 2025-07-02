describe("Testes para o App Cypress Simulator", () => {
  beforeEach("", () => {
    cy.visit(
      "https://cypress-simulator.s3.eu-central-1.amazonaws.com/index.html?skipCaptcha=true",
      {
        onBeforeLoad(win) {
          win.localStorage.setItem("cookieConsent", "accepted");
        },
      }
    );
    cy.contains("button", "Login").click();
  });

  it('Digitar no "Cypress Code" um comando qualquer válido e verificar no "Cypress Output"', () => {
    cy.get("#codeInput").type("cy.visit(url)");
    cy.get("#runButton").click();
    cy.get("#outputArea", { timeout: 10000 })
      .should("be.visible")
      .and("contain", "Success");
  });

  it('Digitar no "Cypress Code" um comando qualquer inválido e verificar no "Cypress Output"', () => {
    cy.get("#codeInput").type("cy.vi(url)");
    cy.get("#runButton").click();
    cy.get("#outputArea", { timeout: 10000 })
      .should("be.visible")
      .and("contain", "Error");
  });

  it('Digitar no "Cypress Code" o comando help e verificar os comandos no "Cypress Output" além do link oficial', () => {
    cy.get("#codeInput").type("help");
    cy.get("#runButton").click();
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
  });

  it('Verificar o Maximizar e Minimizar do "Cypress Output', () => {
    cy.get("#codeInput").type("cy.visit(url)");
    cy.get("#runButton").click();

    cy.get(".expand-collapse").click();

    cy.get("#outputArea", { timeout: 10000 })
      .should("be.visible")
      .and("contain", "Success");

    cy.get("#collapseIcon").should("be.visible");

    cy.get(".expand-collapse").click();

    cy.get("#expandIcon").should("be.visible");
  });

  it("Verificar o Logout da aplicação", () => {
    cy.get("#sandwich-menu").should("be.visible").click();

    cy.get("#logoutButton").should("be.visible").click();

    cy.contains("button", "Login").should("be.visible");
  });

  it("Esconder e mostrar o botão de Logout", () => {
    cy.get("#sandwich-menu").should("be.visible").click();
    cy.get("#logoutButton").should("be.visible");
    cy.get("#sandwich-menu").should("be.visible").click();
    cy.get("#logoutButton").should("not.be.visible");
  });

  it("Verifica o estado transitório da aplicação", () => {
    cy.get("#codeInput").type("cy.visit(url)");
    cy.get("#runButton").click();

    cy.get("#runButton").should("contain", "Running...");

    cy.get("#outputArea")
      .should("be.visible")
      .and("contain", "Running... Please wait.");

    cy.get("#outputArea", { timeout: 10000 })
      .should("be.visible")
      .and("contain", "Success");

    cy.contains("#runButton", "Running...", { timeout: 10000 }).should(
      "not.exist"
    );
  });
});

describe("Testes para os cookies de consentimento", () => {
  beforeEach("", () => {
    cy.visit(
      "https://cypress-simulator.s3.eu-central-1.amazonaws.com/index.html?skipCaptcha=true",
      {
        onBeforeLoad(win) {
          win.localStorage.removeItem("cookieConsent");
        },
      }
    );

    cy.contains("button", "Login").click();
  });

  it("Aceitar os cookies de consentimento", () => {
    cy.get("#cookieConsent")
      .should("be.visible")
      .and("contain", "We use cookies");

    cy.contains("button", "Accept").click();

    cy.get("#cookieConsent").should("not.be.visible");

    cy.window().then((win) => {
      expect(win.localStorage.getItem("cookieConsent")).to.eq("accepted");
    });
  });

  it("Não aceitar os cookies de consentimento", () => {
    cy.get("#cookieConsent")
      .should("be.visible")
      .and("contain", "We use cookies");

    cy.contains("button", "Decline").click();

    cy.get("#cookieConsent").should("not.be.visible");

    cy.window().then((win) => {
      expect(win.localStorage.getItem("cookieConsent")).to.eq("declined");
    });
  });
});

describe("Testes de captcha para o App Cypress Simulator", () => {
  beforeEach("", () => {
    cy.visit(
      "https://cypress-simulator.s3.eu-central-1.amazonaws.com/index.html"
    );
    cy.contains("button", "Login").click();
  });

  it("Verificação de segurança com dados inválidos e status do Botão", () => {
    cy.contains("button", "Verify").should("be.disabled");
    cy.get("#captchaInput").should("have.value", "");

    cy.get("#captchaInput").type(1000);

    cy.contains("button", "Verify").should("not.be.disabled");

    cy.contains("button", "Verify").click();
    cy.contains("#captchaError", "Incorrect answer, please try again");

    cy.contains("button", "Verify").should("be.disabled");

    cy.get("#captchaInput").should("have.value", "");
  });
});
