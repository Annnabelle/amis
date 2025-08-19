import './styles.sass'

interface HeadingProps {
  title: string;
  subtitle?: string;
  totalAmount?: string; 
  children?: React.ReactNode; 
}

const Heading: React.FC<HeadingProps> = ({ title, children, subtitle, totalAmount }) => {
  return (
    <div className='heading'>
      <div className="heading-container">
        <div className="heading-container-items">
          <div className="heading-container-items-item">
            <div className="heading-container-items-item-title">
              <h3 className="title">{title}</h3>
            </div>
            <div className="heading-container-items-item-subtitle">
              <p className="subtitle">
                {subtitle} <span className="subtitle-primary">{totalAmount}</span>
              </p>
            </div>
          </div>
          <div className="heading-container-items-item">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Heading
