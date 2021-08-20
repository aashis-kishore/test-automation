import { Reporter, Context } from '@jest/reporters'
import { AggregatedResult } from '@jest/test-result'

class CustomerReporter implements Pick<Reporter, 'onRunComplete'> {
  onRunComplete = async (context: Set<Context>, results: AggregatedResult) => {
    console.log('Your report is available')
  }
}

export default CustomerReporter
