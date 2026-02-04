import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'app/store'
import { getUserById, changeUserPassword, logout } from 'entities/users/model'
import { Form, Input } from 'antd'
import MainLayout from 'shared/ui/layout'
import Heading from 'shared/ui/mainHeading'
import FormComponent from 'shared/ui/formComponent'
import CustomButton from 'shared/ui/button'
import ModalWindow from 'shared/ui/modalWindow'
import { useNavigate } from 'react-router-dom'

const UserSettings = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.users.userById);
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [formValues, setFormValues] = useState<any>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      dispatch(getUserById({ id: userId }));
    }
  }, [dispatch]);

  const onFinish = (values: any) => {
    setFormValues(values);
    setModalOpen(true);
  };

  const confirmChangePassword = () => {
  const userId = user?.id || localStorage.getItem("userId");
  if (!userId || !formValues) return;

  dispatch(changeUserPassword({ userId, data: formValues }))
    .unwrap()
    .then(() => {
      dispatch(logout());

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userName");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");

      navigate("/");
    })
    .catch((err) => {
      console.error(`${t("changePasswordForm.message.error")}`, err);
    });

  setModalOpen(false);
};


  return (
    <MainLayout>
      <Heading title={t('changePwd.title')} />
      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <div className="box-container-items-item">
              <div className="box-container-items-item-filters">
                <FormComponent onFinish={onFinish}>
                  <div className="form-inputs">
                    <Form.Item
                      className="input"
                      name="currentPassword"
                      label={t('changePwd.changePasswordForm.label.currentPassword')}
                      rules={[{ required: true, message: t('changePwd.changePasswordForm.required.currentPassword') }]}
                    >
                      <Input.Password
                        className="input"
                        size="large"
                        placeholder={t('changePwd.changePasswordForm.placeholder.currentPassword')}
                      />
                    </Form.Item>

                    <Form.Item
                      className="input"
                      name="newPassword"
                      label={t('changePwd.changePasswordForm.label.newPassword')}
                      rules={[
                        { required: true, message: t('changePwd.changePasswordForm.required.newPasswordRequired') },
                        { min: 8, message: t('changePwd.changePasswordForm.required.newPassword') }, // <-- проверка длины
                      ]}
                    >
                      <Input.Password
                        className="input"
                        size="large"
                        placeholder={t('changePwd.changePasswordForm.placeholder.newPassword')}
                      />
                    </Form.Item>
                  </div>

                  <div className="form-inputs">
                    <Form.Item
                      className="input"
                      name="newPasswordConfirmation"
                      label={t('changePwd.changePasswordForm.label.newPasswordConfirmation')}
                      dependencies={['newPassword']}
                      rules={[
                        { required: true, message:  t('changePwd.changePasswordForm.required.newPasswordRequired') },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error(t('changePwd.changePasswordForm.message.passwordsDontMatch'))
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        className="input"
                        size="large"
                        placeholder={t('changePwd.changePasswordForm.placeholder.newPasswordConfirmation')}
                      />
                    </Form.Item>
                  </div>
                  <CustomButton type="submit">
                    {t('btn.edit')}
                  </CustomButton>
                </FormComponent>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalWindow
        titleAction={t('changePwd.confirmModal.title')}
        openModal={modalOpen}
        closeModal={() => setModalOpen(false)}
        classDangerName="danger-title"
      >
        <div className="delete-modal">
          <div className="delete-modal-title">
            <p className="title">{t('changePwd.confirmModal.subtitle')}</p>
          </div>
          <div className="delete-modal-btns">
            <CustomButton className="danger" onClick={confirmChangePassword}>
              {t('changePwd.confirmModal.btn.confirm')}
            </CustomButton>
            <CustomButton onClick={() => setModalOpen(false)} className="outline">
              {t('changePwd.confirmModal.btn.cancel')}
            </CustomButton>
          </div>
        </div>
      </ModalWindow>
    </MainLayout>
  )
}

export default UserSettings




