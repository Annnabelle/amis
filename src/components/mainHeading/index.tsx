import './styles.sass'

interface SubtitleBlock {
  title?: string;
  value?: string;
}

interface HeadingProps {
  title: string;
  subtitle?: string;
  totalAmount?: string;
  children?: React.ReactNode;
  extraSubtitles?: {
    orderNumber?: SubtitleBlock;
    orderTime?: SubtitleBlock;
    orderStatus?: SubtitleBlock;
    turonOrderID?: SubtitleBlock;
  };
}

const Heading: React.FC<HeadingProps> = ({
  title,
  children,
  subtitle,
  totalAmount,
  extraSubtitles
}) => {
  return (
    <div className='heading'>
      <div className="heading-container">
        <div className="heading-container-items">
          <div className="heading-container-items-item">
            <div className="heading-container-items-item-title">
              <h3 className="title">{title}</h3>
            </div>
            <div className="heading-container-items-item-subtitle">
              {totalAmount && (
                <p className="subtitle">
                  {subtitle} <span className="subtitle-primary">{totalAmount}</span>
                </p>
              )}

              {extraSubtitles && (
                <div className="extra-subtitles">
                  {extraSubtitles?.orderNumber?.value && (
                    <p className="subtitle extra-subtitle">
                      {extraSubtitles.orderNumber.title}{' '}
                      <span className="subtitle-primary">
                        {extraSubtitles.orderNumber.value}
                      </span>
                    </p>
                  )}

                  {extraSubtitles?.orderTime?.value && (
                    <p className="subtitle extra-subtitle">
                      {extraSubtitles.orderTime.title}{' '}
                      <span className="subtitle-primary">
                        {extraSubtitles.orderTime.value}
                      </span>
                    </p>
                  )}

                  {extraSubtitles?.orderStatus?.value && (
                    <p className="subtitle extra-subtitle">
                      {extraSubtitles.orderStatus.title}{' '}
                      <span className="subtitle-primary">
                        {extraSubtitles.orderStatus.value}
                      </span>
                    </p>
                  )}

                  {extraSubtitles?.turonOrderID?.value && (
                    <p className="subtitle extra-subtitle">
                      {extraSubtitles.turonOrderID.title}{' '}
                      <span className="subtitle-primary">
                        {extraSubtitles.turonOrderID.value}
                      </span>
                    </p>
                  )}
                </div>
              )}

            </div>
          </div>

          <div className="heading-container-items-item">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heading;
