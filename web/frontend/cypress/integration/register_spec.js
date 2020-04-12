describe('Register', () => {
  it('shows the register form when the register button is clicked', () => {
    cy.visit('http://localhost:8080/');
    cy.contains('Register').click();

    cy.get('div.heading > span').invoke('text').then((text) => {
      expect(text).to.equal('Register');
    });
  });

  it('shows the sign in form when the sign in button is clicked', () => {
    cy.visit('http://localhost:8080/');
    cy.contains('Register').click();
    cy.contains('Sign In').click();

    cy.get('div.heading > span').invoke('text').then((text) => {
      expect(text).to.equal('Sign In');
    });
  });

  it('contains an email address field, password field, and a confirm password field', () => {
    cy.visit('http://localhost:8080/');
    cy.contains('Register').click();

    cy.get('label').then((labels) => {
      expect(labels[0].innerText).to.equal('Email Address');
      expect(labels[1].innerText).to.equal('Password');
      expect(labels[2].innerText).to.equal('Confirm Password');

      expect(cy.get(labels[0]).parent().find('input')).to.exist;
      expect(cy.get(labels[1]).parent().find('input')).to.exist;
      expect(cy.get(labels[2]).parent().find('input')).to.exist;
    });
  });

  it('shows all error messages when all fields are empty after clicking submit', () => {
    cy.visit('http://localhost:8080/');
    cy.contains('Register').click();

    cy.contains('Submit').parent().click();

    cy.get('div.el-form-item__error').then((errors) => {
      expect(errors).to.have.lengthOf(3);
    });
  });

  it('shows an error message when an input is not an email address', () => {
    cy.visit('http://localhost:8080/');
    cy.contains('Register').click();

    cy.get('label').then((labels) => {
      const emailDiv = cy.get(labels[0]).parent();

      emailDiv.find('input').type('test.com').blur();

      expect(cy.contains('Please enter your email address.')).to.exist;
    });
  });
});
