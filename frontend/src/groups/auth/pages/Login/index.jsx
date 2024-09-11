import React, { useCallback, useState } from "react";
import { CardBody, Card } from "reactstrap";
import { useNavigate } from "react-router-dom";
import FormikInput from "../../../../base/components/FormikInput";
import { Formik } from "formik";
import AuthCardContainer from "../../components/AuthCardContainer";
import Logo from "../../components/Logo";
import AuthHeader from "../../components/Header";
import { useService } from "../../../../base/hooks/useService";
import AuthService from "../../../../services/AuthService";
import { useLoading } from "../../../../base/hooks/useLoading";
import SessionStorage from "../../../../services/SessionStorage";
import Button from "../../../../base/components/Button/index";
import { BUTTON_COLORS, BUTTON_STYLES } from "../../../../base/components/Button/appearance";
import { initialValues, validationSchema } from "./form";
import { MAX_PASSWORD_LENGTH } from "../../../../validation/lengthConstants";
import ToasterService from "../../../../services/ToastService";
import { APP_GROUP_LINKS } from "../../../app/config";

const Login = () => {
  /**
   * @type {AuthService}
   */
  const authService = useService(AuthService);
  /**
   * @type {SessionStorage}
   */
  const storageSession = useService(SessionStorage);
  /**
   * @type {ToasterService}
   */
  const toatsService = useService(ToasterService);

  const navigate = useNavigate();

  const [isLoading, { registerPromise }] = useLoading();
  const [requestError, setRequestError] = useState(false);

  const loginUser = useCallback((values) => {
    registerPromise(authService.login(values))
      .then((session) => {
        storageSession.setSession(session);
        navigate(APP_GROUP_LINKS.BASE)
      })
      .catch(() => {
        toatsService.error("Incorrect credentials")
        setRequestError(true);
      })
  }, [registerPromise, authService, storageSession, navigate]);

  return (
    <AuthCardContainer metaText="Login">
      <Card className="overflow-hidden">
        <AuthHeader
          headerText="Welcome Back !"
          className="auth-header"
        />

        <CardBody className="pt-0">
          <Logo/>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            validateOnBlur
            validateOnMount
            onSubmit={(values) => {
              loginUser(values);
            }}
          >
            {({ errors, handleSubmit, values }) => (
              <form className="form-horizontal p-2" onSubmit={handleSubmit}>
                <FormikInput
                  id="email"
                  name="email"
                  label="Email"
                  containerClassName="mb-3"
                  placeholder="Enter email"
                  type="email"
                  afterOnChange={() => setRequestError(false)}
                />

                <FormikInput
                  id="password"
                  label="Password"
                  name="password"
                  type="password"
                  withEyeOption={values.password?.length}
                  containerClassName="position-relative"
                  placeholder="Enter password"
                  maxLength={MAX_PASSWORD_LENGTH}
                  afterOnChange={() => setRequestError(false)}
                />

                <Button
                  color={BUTTON_COLORS.primary}
                  type="submit"
                  block={BUTTON_STYLES.block}
                  loading={isLoading}
                  className="mt-3"
                  disabled={isLoading || !!Object.keys(errors).length || requestError}
                >
                  Sign In
                </Button>
              </form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </AuthCardContainer>
  );
};

export default Login;
