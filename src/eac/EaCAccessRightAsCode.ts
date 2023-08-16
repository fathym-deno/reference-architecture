export interface IEaCAccessRightAsCode {

}

export interface IEaCAccessRightDetails {

}

export interface IEaCAccessRightAsCodeClass {

}

// Existing code...

[DataContract]
public record EaCAccessRightAsCode : EaCDetails<EaCAccessRightDetails>
{ }

[DataContract]
public record EaCAccessRightDetails : EaCVertexDetails
{ }