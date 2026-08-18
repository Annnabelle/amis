import { Empty, Form, Input, Select, Tag } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "app/store";
import { useCan } from "entities/access/lib";
import { getLeadById, updateLeadStatus } from "entities/leads/model";
import { LeadStatuses, type LeadStatus } from "entities/leads/types";
import { endpointAccessMap } from "shared/config/endpointAccessMap";
import CustomButton from "shared/ui/button";
import FormComponent from "shared/ui/formComponent";
import MainLayout from "shared/ui/layout";
import Heading from "shared/ui/mainHeading";
import { statusColors } from "shared/ui/statuses";
import "../styles.sass";

type StatusForm = {
  status: LeadStatus;
  comment?: string;
};

const formatValue = (value?: string | null) => value || "-";
const formatDateTime = (value?: string) =>
  value ? dayjs(value).format("DD.MM.YYYY HH:mm") : "-";

const LeadDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const canUpdateStatus = useCan(endpointAccessMap.leadsUpdateStatus);
  const lead = useAppSelector((state) => state.leads.leadById);
  const isLoading = useAppSelector((state) => state.leads.isLoading);
  const [form] = Form.useForm<StatusForm>();

  useEffect(() => {
    if (id) {
      dispatch(getLeadById({ id }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    const currentLead = lead;

    if (!currentLead || currentLead.id !== id) {
      return;
    }

    form.setFieldsValue({
      status: currentLead.status,
      comment: currentLead.comment,
    });
  }, [form, id, lead]);

  const statusOptions = useMemo(
    () =>
      LeadStatuses.map((status) => ({
        value: status,
        label: t(`leads.statuses.${status}`),
      })),
    [t]
  );

  const handleStatusUpdate = async (values: StatusForm) => {
    if (!id) return;

    const result = await dispatch(
      updateLeadStatus({
        id,
        data: {
          status: values.status,
          comment: values.comment?.trim() || undefined,
        },
      })
    );

    if (updateLeadStatus.fulfilled.match(result)) {
      toast.success(t("leads.messages.statusUpdated"));
      return;
    }

    toast.error(result.payload ?? t("leads.messages.statusUpdateError"));
  };

  if (isLoading && lead?.id !== id) {
    return null;
  }

  if (!lead || lead.id !== id) {
    return (
      <MainLayout>
        <Heading title={t("leads.detailsTitle")} subtitle={t("common.details")}>
          <CustomButton className="outline" onClick={() => navigate("/leads")}>
            {t("common.backToList")}
          </CustomButton>
        </Heading>
        <div className="box">
          <div className="box-container">
            <div className="box-container-items">
              <Empty description={t("common.dataNotFound")} />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const metaItems = [
    { label: t("leads.fields.phone"), value: lead.phone },
    { label: t("leads.fields.company"), value: formatValue(lead.company) },
    { label: t("leads.fields.tariff"), value: formatValue(lead.tariff) },
    { label: t("leads.fields.createdAt"), value: formatDateTime(lead.createdAt) },
  ];

  const statusItems = [
    { label: t("leads.fields.statusChangedAt"), value: formatDateTime(lead.statusChangedAt) },
    { label: t("leads.fields.updatedAt"), value: formatDateTime(lead.updatedAt) },
  ];

  return (
    <MainLayout>
      <Heading title={t("leads.detailsTitle")} subtitle={t("common.details")}>
        <CustomButton className="outline" onClick={() => navigate("/leads")}>
          {t("common.backToList")}
        </CustomButton>
      </Heading>

      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <div className="route-overview-card leads-overview-card">
              <div className="route-overview-head">
                <div className="route-overview-title leads-overview-title">
                  <div className="leads-overview-person">
                    <div className="leads-overview-avatar">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <h2>{lead.name}</h2>
                  </div>
                </div>
                <div className="route-overview-status">
                  <div className="invoice-status-pair-item">
                    <Tag
                      className="leads-status-tag"
                      color={statusColors[lead.status] ?? "default"}
                      style={{ margin: 0 }}
                    >
                      {t(`leads.statuses.${lead.status}`)}
                    </Tag>
                  </div>
                </div>
              </div>

              <div className="route-overview-meta">
                {metaItems.map((item) => (
                  <div className="route-meta-chip" key={item.label}>
                    <span className="label">{item.label}</span>
                    <span className="value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-grid detail-grid-secondary">
              <div className="detail-card detail-card-wide">
                <h4>{t("leads.sections.status")}</h4>
                <div className="detail-items">
                  <div className="detail-item">
                    <span className="label inline-label">{t("leads.fields.status")}</span>
                    <span className="detail-separator">:</span>
                    <Tag
                      className="leads-status-tag"
                      color={statusColors[lead.status] ?? "default"}
                      style={{ margin: 0 }}
                    >
                      {t(`leads.statuses.${lead.status}`)}
                    </Tag>
                  </div>
                  {statusItems.map((item) => (
                    <div className="detail-item" key={item.label}>
                      <span className="label inline-label">{item.label}</span>
                      <span className="detail-separator">:</span>
                      <span className="value">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-card">
                <h4>{t("leads.fields.comment")}</h4>
                <div className="detail-text-block">{formatValue(lead.comment)}</div>
              </div>
            </div>

            <div className="detail-grid detail-grid-single">
              <div className="detail-card detail-card-full">
                <h4>{t("leads.fields.message")}</h4>
                <div className="detail-text-block">{formatValue(lead.message)}</div>
              </div>
            </div>

            {canUpdateStatus && (
              <div className="detail-grid detail-grid-single">
                <div className="detail-card detail-card-full leads-processing-card">
                  <h4>{t("leads.sections.processing")}</h4>
                  <FormComponent form={form} onFinish={handleStatusUpdate}>
                    <div className="leads-processing-form-grid">
                      <Form.Item
                        className="input"
                        name="status"
                        label={t("leads.fields.status")}
                        rules={[{ required: true, message: t("leads.validation.statusRequired") }]}
                      >
                        <Select size="large" options={statusOptions} />
                      </Form.Item>
                      <Form.Item
                        className="input"
                        name="comment"
                        label={t("leads.fields.comment")}
                      >
                        <Input.TextArea className="leads-processing-textarea" rows={3} />
                      </Form.Item>
                    </div>
                    <div className="leads-processing-actions">
                      <CustomButton type="submit">
                        {t("leads.actions.saveStatus")}
                      </CustomButton>
                    </div>
                  </FormComponent>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LeadDetails;
