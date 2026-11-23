import './styles.sass'
import { WalletOutlined } from "@ant-design/icons";

const Balance = () => {
  return (
     <div className="balance">
      <div className="balance-container">
        <div className="balance-container-items">
          <div className="balance-container-items-item">
            <div className="item-icon"><WalletOutlined/></div>
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


