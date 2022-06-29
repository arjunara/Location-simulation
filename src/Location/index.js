import { Tooltip } from '@mui/material';
import './index.css';

const LocationBlock = props =>{
    return (
        <Tooltip title={props.barcode}>
            <div className="block">
                <span>{props.deep}</span>
                
        </div>
        </Tooltip>
    )
}

export default LocationBlock