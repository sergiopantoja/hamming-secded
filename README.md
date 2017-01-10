# hamming-secded

Generate and check Hamming Code with single-error correction (SEC) and double error detection (DED) in Javascript.

##### Please Note: This is currently in alpha.

## Usage

```javascript
var hamming = require('hamming-secded');

var data = hamming.generate('10010100');
var check = hamming.check(data); // {status: 'CORRECT', data: '10010100'}
```
