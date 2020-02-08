document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  const { elements } = form;

  const validators = {
    length: (min, max) => value => value.length >= min && value.length <= max,
    required: () => value => value.length > 0,
    checkPasswordMatch: passwordValue => value => value === passwordValue,
    email: () => value => {
      const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
      return re.test(String(value).toLowerCase());
    },
  };

  const validate = {
    error: (inputEl, error) => {
      const formControlEl = inputEl.parentElement;
      formControlEl.className = 'form__control error';

      const messageEl = formControlEl.querySelector('.form__message');
      messageEl.textContent = error;
    },
    success: inputEl => {
      const formControlEl = inputEl.parentElement;
      formControlEl.className = 'form__control success';
    },
  };

  const isValidForm = schema => {
    return Object.keys(schema)
      .map(name => {
        const field = elements[name];
        const { value } = field;

        const isFieldValid = schema[name]
          .reverse()
          .map(({ test, message }) => {
            const isRuleValid = test(value);
            if (!isRuleValid) validate.error(field, message);
            return isRuleValid;
          })
          .every(isValid => isValid);

        if (isFieldValid) validate.success(field);
        return isFieldValid;
      })
      .every(isValid => isValid);
  };

  const handlerFormSubmit = event => {
    event.preventDefault();

    const schema = {
      username: [
        {
          test: validators.required(),
          message: 'username is Required',
        },
        {
          test: validators.length(3, 13),
          message: 'username is Required',
        },
      ],
      email: [
        {
          test: validators.required(),
          message: 'email is Required',
        },
        {
          test: validators.email(),
          message: 'email is not valid',
        },
      ],
      password: [
        {
          test: validators.required(),
          message: 'password is Required',
        },
        {
          test: validators.length(6, 8),
          message: 'password must have 6 characters',
        },
      ],
      password2: [
        {
          test: validators.required(),
          message: 'password is Required',
        },
        {
          test: validators.length(6, 8),
          message: 'password must have 6 characters',
        },
        {
          test: validators.checkPasswordMatch(elements.password.value),
          message: 'both passwords must be equal',
        },
      ],
    };

    if (isValidForm(schema)) {
      // do something
    }
  };

  // Events
  form.addEventListener('submit', handlerFormSubmit);
});
