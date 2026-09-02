import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'app/store'
import { changeOwnPassword, fetchCurrentUser } from 'entities/users/model'
import type { ChangePassword } from 'entities/users/types'
import { Form, Input } from 'antd'
import MainLayout from 'shared/ui/layout'
import Heading from 'shared/ui/mainHeading'
import FormComponent from 'shared/ui/formComponent'
import CustomButton from 'shared/ui/button'
import ModalWindow from 'shared/ui/modalWindow'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const ChangePasswordPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.users.currentUser);

  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [formValues, setFormValues] = useState<ChangePassword | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      dispatch(fetchCurrentUser());
    }
  }, [currentUser, dispatch]);

  const onFinish = (values: ChangePassword) => {
    setFormValues(values);
    setModalOpen(true);
  };

  const confirmChangePassword = () => {
    if (!formValues || isSubmitting) return;

    setIsSubmitting(true);
    dispatch(changeOwnPassword(formValues))
      .unwrap()
      .then(() => {
        toast.success(t('changePwd.changePasswordForm.message.success'));
        setModalOpen(false);
        setFormValues(null);
        form.resetFields();
        navigate('/profile');
      })
      .catch((error: unknown) => {
        const message =
          typeof error === 'string' && error.trim()
            ? error
            : t('changePwd.changePasswordForm.message.error');
        toast.error(message);
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <MainLayout>
      <Heading title={t('changePwd.title')} />
      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <div className="box-container-items-item">
              <div className="box-container-items-item-filters">
                <FormComponent form={form} onFinish={onFinish}>
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
                        autoComplete="current-password"
                        placeholder={t('changePwd.changePasswordForm.placeholder.currentPassword')}
                      />
                    </Form.Item>

                    <Form.Item
                      className="input"
                      name="newPassword"
                      label={t('changePwd.changePasswordForm.label.newPassword')}
                      rules={[
                        { required: true, message: t('changePwd.changePasswordForm.required.newPasswordRequired') },
                        { min: 6, message: t('changePwd.changePasswordForm.required.newPassword') },
                      ]}
                    >
                      <Input.Password
                        className="input"
                        size="large"
                        autoComplete="new-password"
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
                        { required: true, message: t('changePwd.changePasswordForm.required.newPasswordRequired') },
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
                        autoComplete="new-password"
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
            <CustomButton variant="danger" onClick={confirmChangePassword} disabled={isSubmitting}>
              {t('changePwd.confirmModal.btn.confirm')}
            </CustomButton>
            <CustomButton onClick={() => setModalOpen(false)} variant="outline">
              {t('changePwd.confirmModal.btn.cancel')}
            </CustomButton>
          </div>
        </div>
      </ModalWindow>
    </MainLayout>
  )
}

export default ChangePasswordPage
