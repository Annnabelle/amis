import { FieldTimeOutlined } from '@ant-design/icons'
import './styles.sass'

const Session = () => {
  return (
    <div className="session">
      <div className="session-container">
        <div className="session-container-items">
          <div className="session-container-items-item">
            <div className="item-icon"><FieldTimeOutlined /></div>
          </div>
        </div>
        <div className="session-container-items">
          <div className="session-container-items-item">
            <div className="item-title">
              <p className="title">Окончание сессии через:</p>
            </div>
          </div>
          <div className="session-container-items-item">
            <div className="item-timer">
              <p className="timer">22:37:10</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Session