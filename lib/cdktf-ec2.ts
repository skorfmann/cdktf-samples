import { Construct } from 'constructs';
import { Token } from 'cdktf';
import { DataAwsAmi, DataAwsAvailabilityZones as AZ } from '../.gen/providers/aws'
// import { Ec2Instance } from './.gen/modules/terraform-aws-modules/ec2-instance/aws';
import { Vpc } from '../.gen/modules/terraform-aws-modules/vpc/aws';



export interface VpcBaseProps {
  readonly cidr?: string;
  readonly privateSubnets?: string[];
  readonly publicSubnets?: string[];
  readonly enableNatGateway?: boolean;
  readonly singleNatGateway?: boolean;
}

export class VpcProvider extends Construct{
  readonly privateSubnets: string[]
  readonly publicSubnets?: string[];
  readonly vpc: Vpc;

  static getOrCreate(scope: Construct) {
    return new VpcProvider(scope, 'Vpc')
  }
  constructor(scope: Construct, id: string, props: VpcBaseProps = {}){
    super(scope, id)

    this.vpc = new Vpc(scope, 'VpcResource', {
      cidr:  props.cidr ?? '10.0.0.0/16',
      privateSubnets: props.privateSubnets ?? ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"],
      publicSubnets: props.publicSubnets ?? ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"],
      azs: new AZ(scope, 'AZs').names,
      enableNatGateway: props.enableNatGateway ?? true,
      singleNatGateway: props.singleNatGateway ?? true,
    })
    
    this.publicSubnets = Token.asList(this.vpc.publicSubnetsOutput)
    this.privateSubnets = Token.asList(this.vpc.privateSubnetsOutput)

  }
}

export class MachineImage {
  static latestAmazonLinux2Ami(stack: Construct) {
    return new DataAwsAmi(stack, 'AmiDAta', {
      owners: ['amazon'],
      mostRecent: true,
      filter: [
        {
          name: 'owner-alias',
          values: ['amazon'],
        },
        {
          name: 'name',
          values: ['amzn2-ami-hvm*'],
        }
      ]
    })
  }
}
