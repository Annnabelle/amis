import './styles.sass'

interface HeadingProps {
  title: string;
  children?: React.ReactNode; 
}

const Heading: React.FC<HeadingProps> = ({ title, children }) => {
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
                Всего: <span className="subtitle-primary">100</span>
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
