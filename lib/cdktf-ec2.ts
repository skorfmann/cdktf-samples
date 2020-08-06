import { Construct } from 'constructs';
import { DataAwsAmi, DataAwsAvailabilityZones as AZ } from '../.gen/providers/aws'
// import { Ec2Instance } from './.gen/modules/terraform-aws-modules/ec2-instance/aws';
import { Vpc } from '../.gen/modules/terraform-aws-modules/vpc/aws';


export class VpcProvider {
  static getOrCreate(stack: Construct) {
    return new Vpc(stack, 'Vpc', {
      cidr: '10.0.0.0/16',
      privateSubnets: ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"],
      publicSubnets: ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"],
      azs: new AZ(stack, 'AZs').names,
      enableNatGateway: true,
      singleNatGateway: true,
    })
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
