export interface IEaCAccessRightAsCode {

}

export interface IEaCAccessRightDetails {

}

// Existing code...

[DataContract]
public record EaCAccessRightAsCode : EaCDetails<EaCAccessRightDetails>
{ }

[DataContract]
public record EaCAccessRightDetails : EaCVertexDetails
{ }