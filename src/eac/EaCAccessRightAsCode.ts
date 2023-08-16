export interface IEaCAccessRightAsCode {

}

export interface IEaCAccessRightDetails {

}

export interface IEaCAccessRightAsCodeClass {

}

export interface IDataContract {

}

// Existing code...

[DataContract]
public record EaCAccessRightAsCode : EaCDetails<EaCAccessRightDetails>
{ }

[DataContract]
public record EaCAccessRightDetails : EaCVertexDetails
{ }