import 'rc-time-picker/assets/index.less';

import React from 'react';
import ReactDom from 'react-dom';
import TimePicker from 'rc-time-picker';

ReactDom.render(
  <TimePicker
    defaultValue={new Date()}
    showSecond={false}
    minuteStep={5}
    onChange={value => console.log(value)}
  />,
  document.getElementById('__react-content'),
);
