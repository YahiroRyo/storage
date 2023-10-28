package aws

import (
	"context"
	"fmt"
	"io"

	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/samber/lo"
)

type S3 struct {
	s3.Client
}

func (s *S3) UploadSingleObject(bucket string, key string, reader io.Reader) (*string, error) {
	_, err := s.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(key),
		Body:   reader,
	})
	if err != nil {
		return nil, err
	}

	return lo.ToPtr(fmt.Sprintf("https://pub-66e0c49d80ce442da586f792084cc37d.r2.dev/%s", key)), nil
}
