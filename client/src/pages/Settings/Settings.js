import React from 'react';
import Page from 'components/base/Page/Page';
import Input from 'components/base/Input/Input';
import TextField from 'components/common/TextField/TextField';

import './Settings.css';
import Button from 'components/base/Button/Button';
import Form, { FormInputGroup, FormSubmitGroup } from 'components/common/Form/Form';

function Settings() {
  return (
    <Page contentClass="container">
      <div className="settings">
        <div className="settings__elem">
          <h4 className="typography__elem typography__headline4">Settings</h4>
          <p className="typography__elem typography__subtitle2">
            Configure repository connection and synchronization settings.
          </p>
        </div>

        <Form className="settings__elem">
          <FormInputGroup>
            <TextField
              label="GitHub repository"
              htmlFor="repository"
              mods={{ required: true }}
              mix={['form']}
            >
              <Input
                mods={{ clear: true, fullwidth: true }}
                mix={['textfield']}
                className="kek"
                type="text"
                placeholder="user-name/repo-name"
                id="repository"
                required
              ></Input>
            </TextField>

            <TextField label=" Build command" htmlFor="command" mix={['form']}>
              <Input
                mods={{ clear: true, fullwidth: true }}
                mix={['textfield']}
                type="text"
                placeholder="npm run build"
                id="command"
                defaultValue="npm ci && npm run build"
              ></Input>
            </TextField>

            <TextField label="Main branchName" htmlFor="branchName" mix={['form']}>
              <Input
                mods={{ clear: true, fullwidth: true }}
                mix={['textfield']}
                type="text"
                placeholder="master"
                id="branchName"
                defaultValue="master"
              ></Input>
            </TextField>
          </FormInputGroup>

          <FormInputGroup>
            <TextField
              label="Synchronize every"
              htmlFor="synchronizeTime"
              mods={{ row: true }}
              mix={['form']}
              appendText="minutes"
            >
              <Input
                mods={{ counter: true }}
                mix={['textfield']}
                type="text"
                inputMode="numeric"
                placeholder="10"
                id="synchronizeTime"
                defaultValue="10"
              ></Input>
            </TextField>
          </FormInputGroup>

          <FormSubmitGroup>
            <Button type="submit" mods={{ action: true }} className="form__submit-group-elem">
              Save
            </Button>
            <Button href="/" className="form__submit-group-elem">
              Cancel
            </Button>
          </FormSubmitGroup>
        </Form>
      </div>
    </Page>
  );
}

export default Settings;
