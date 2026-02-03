import { TbPigMoney } from 'react-icons/tb'
import './styles.sass'

const Balance = () => {
  return (
     <div className="balance">
      <div className="balance-container">
        <div className="balance-container-items">
          <div className="balance-container-items-item">
            <div className="item-icon"><TbPigMoney/></div>
          </div>
        </div>
        <div className="balance-container-items">
          <div className="balance-container-items-item">
            <div className="item-title">
              <p className="title">Баланс: 0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Balance


